const express = require('express');
const router = express.Router();
const multer = require('multer');
const ragService = require('../services/ragService');
const { MongoClient } = require('mongodb');
const { OpenAI } = require('openai');

const upload = multer({ dest: 'uploads/' });

// Store deployment progress
const deployments = new Map();

// Add this function at the top of the file
const buildMedicalQuery = (queryText) => {
  queryText = queryText.toLowerCase();
  
  // Query patterns
  const patterns = {
    humira: {
      $or: [
        { medications: { $regex: /humira/i } },
        { medical_notes: { $regex: /humira/i } }
      ]
    },
    ozempic: {
      $or: [
        { medications: { $regex: /ozempic/i } },
        { medical_notes: { $regex: /ozempic/i } }
      ]
    },
    diabetes: {
      $or: [
        { conditions: { $regex: /diabetes/i } },
        { medical_notes: { $regex: /diabetes/i } }
      ]
    },
    arthritis: {
      $or: [
        { conditions: { $regex: /arthritis/i } },
        { medical_notes: { $regex: /arthritis/i } }
      ]
    }
  };

  // Build query based on keywords
  const queryParts = [];
  Object.entries(patterns).forEach(([keyword, query]) => {
    if (queryText.includes(keyword)) {
      queryParts.push(query);
    }
  });

  return queryParts.length > 0 ? { $or: queryParts.map(q => q.$or).flat() } : {};
};

router.post('/deploy', upload.array('documents'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error('No documents provided');
    }

    const { vectorDB, config } = req.body;
    if (!vectorDB) {
      throw new Error('Vector database type not specified');
    }

    // Generate deployment ID
    const deploymentId = `deploy-${Date.now()}`;
    
    // Store initial deployment state
    deployments.set(deploymentId, {
      status: 'initializing',
      progress: 0,
      logs: [],
      error: null
    });

    // Start deployment process in background
    ragService.deployRAGAgent(
      req.files,
      vectorDB,
      JSON.parse(config || '{}'),
      (type, message, progress = null) => {
        const deployment = deployments.get(deploymentId);
        if (!deployment) return;

        if (type === 'status') {
          deployment.status = message;
          deployment.progress = progress;
        } else if (type === 'log') {
          deployment.logs.push(message);
        }
        deployments.set(deploymentId, deployment);
      }
    ).then(result => {
      const deployment = deployments.get(deploymentId);
      if (deployment) {
        deployment.status = 'completed';
        deployment.progress = 100;
        deployment.result = result;
        deployments.set(deploymentId, deployment);
      }
    }).catch(error => {
      console.error('Deployment process error:', error);
      const deployment = deployments.get(deploymentId);
      if (deployment) {
        deployment.status = 'failed';
        deployment.error = error.message;
        deployments.set(deploymentId, deployment);
      }
    });

    // Return deployment ID immediately
    res.json({ deploymentId });
  } catch (error) {
    console.error('RAG deployment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// SSE endpoint for deployment status
router.get('/deploy/:deploymentId/status', (req, res) => {
  const { deploymentId } = req.params;

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send initial status
  const deployment = deployments.get(deploymentId);
  if (!deployment) {
    res.write(`data: ${JSON.stringify({ error: 'Deployment not found' })}\n\n`);
    res.end();
    return;
  }

  // Function to send updates
  const sendUpdate = () => {
    const currentState = deployments.get(deploymentId);
    if (currentState) {
      res.write(`data: ${JSON.stringify({
        status: currentState.status,
        progress: currentState.progress,
        logs: currentState.logs,
        error: currentState.error,
        deployment: currentState.result,
        complete: currentState.status === 'completed' || currentState.status === 'failed'
      })}\n\n`);

      // Clean up if deployment is complete
      if (currentState.status === 'completed' || currentState.status === 'failed') {
        clearInterval(intervalId);
        deployments.delete(deploymentId);
        res.end();
      }
    }
  };

  // Send updates every second
  const intervalId = setInterval(sendUpdate, 1000);
  sendUpdate(); // Send initial update

  // Clean up on client disconnect
  res.on('close', () => {
    clearInterval(intervalId);
  });
});

router.post('/query', async (req, res) => {
  try {
    const { type, config, query } = req.body;
    
    if (type === 'mongodb') {
      const { url, database, collection } = config;
      console.log('Query params:', { database, collection, query });

      if (!url || !database || !collection) {
        throw new Error('Missing MongoDB configuration');
      }

      const client = new MongoClient(url);
      await client.connect();
      console.log('Connected to MongoDB successfully');
      
      const db = client.db(database);
      const coll = db.collection(collection);

      const docCount = await coll.countDocuments();
      console.log(`Total documents in collection: ${docCount}`);

      // Use $or to search across multiple fields
      const queryObj = buildMedicalQuery(query);
      const results = await coll.find(queryObj).toArray();

      console.log('Search results:', results);

      await client.close();

      if (results.length === 0) {
        return res.json({
          answer: "No relevant patients found.",
          sources: []
        });
      }

      // Generate a summary using OpenAI
      const openai = new OpenAI();
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a medical assistant helping to analyze patient records. Provide clear, concise summaries."
          },
          {
            role: "user",
            content: `Based on these patient records, ${query}\n\nPatient Records:\n${JSON.stringify(results, null, 2)}`
          }
        ]
      });

      res.json({
        answer: completion.choices[0].message.content,
        sources: results.map(doc => ({
          patient_id: doc.patient_id,
          name: `${doc.first_name} ${doc.last_name}`,
          conditions: doc.conditions || [],
          medications: doc.medications || [],
          relevance: 100
        })).filter(source => source.name && source.patient_id) // Ensure we have valid sources
      });
    } else {
      throw new Error('Unsupported query type');
    }
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Failed to execute query', details: error.message });
  }
});

// Add health check endpoint
router.get('/health/chromadb', async (req, res) => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/heartbeat');
    if (!response.ok) {
      throw new Error('ChromaDB health check failed');
    }
    res.json({ status: 'healthy' });
  } catch (error) {
    console.error('ChromaDB health check error:', error);
    res.status(503).json({ 
      error: 'ChromaDB is not accessible',
      details: error.message 
    });
  }
});

router.post('/test-mongodb', async (req, res) => {
  try {
    let { url } = req.body;
    if (!url) {
      throw new Error('MongoDB URL is required');
    }

    // Parse and reconstruct the URL to ensure proper encoding
    try {
      const urlParts = new URL(url);
      // Extract credentials from the URL
      const [username, password] = urlParts.username && urlParts.password ? 
        [urlParts.username, urlParts.password] : 
        url.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);

      if (!username || !password) {
        throw new Error('Invalid MongoDB URL format: missing credentials');
      }

      // Reconstruct the URL with encoded credentials
      url = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${urlParts.host}${urlParts.pathname}${urlParts.search}`;
    } catch (error) {
      throw new Error(`Invalid MongoDB URL format: ${error.message}`);
    }

    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    await client.db('admin').command({ ping: 1 });
    
    // Check if Vector Search is enabled
    try {
      const dbList = await client.db().admin().listDatabases();
      console.log('Connected to MongoDB Atlas successfully');
    } catch (error) {
      console.warn('Could not verify Vector Search capability:', error);
    }

    await client.close();

    res.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB Atlas'
    });
  } catch (error) {
    console.error('MongoDB connection test error:', error);
    res.status(500).json({ 
      error: 'Failed to connect to MongoDB',
      details: error.message,
      help: 'Make sure your connection string is correct and the IP address is whitelisted in MongoDB Atlas'
    });
  }
});

router.post('/mongodb-collections', async (req, res) => {
  try {
    let { url } = req.body;
    if (!url) {
      throw new Error('MongoDB URL is required');
    }

    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // List all databases
    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();
    
    // Get collections from all databases except admin and local
    const collectionsWithInfo = [];
    
    for (const db of dbList.databases) {
      if (db.name !== 'admin' && db.name !== 'local') {
        const database = client.db(db.name);
        const collections = await database.listCollections().toArray();
        
        // Get info for each collection
        for (const collection of collections) {
          collectionsWithInfo.push({
            id: `${db.name}.${collection.name}`,  // Format: "database.collection"
            database: db.name,
            name: collection.name,
            documentCount: await database.collection(collection.name).countDocuments(),
            size: db.sizeOnDisk,
            displayName: `${db.name}.${collection.name}` // For dropdown display
          });
        }
      }
    }

    await client.close();

    console.log('Found collections:', collectionsWithInfo);

    res.json({ 
      success: true,
      collections: collectionsWithInfo
    });
  } catch (error) {
    console.error('MongoDB collections fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch collections',
      details: error.message
    });
  }
});

module.exports = router; 