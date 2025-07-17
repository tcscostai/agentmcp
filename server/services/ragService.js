const { OpenAI } = require('openai');
const { ChromaClient } = require('chromadb');
const { PineconeClient } = require('@pinecone-database/pinecone');
const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const { splitIntoChunks } = require('../utils/textChunker');

class RAGService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.deployments = new Map();
    this.BATCH_SIZE = 3; // Reduce batch size for better reliability
    this.TIMEOUT = 120000; // Increase timeout to 2 minutes
    this.MAX_RETRIES = 3; // Add retry attempts
    
    // Initialize ChromaDB client with proper configuration
    this.chromaClient = new ChromaClient({
      path: process.env.CHROMA_SERVER_URL || 'http://localhost:8000'
    });
  }

  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async generateEmbeddingsBatch(chunks, retryCount = 0) {
    try {
      const response = await Promise.race([
        this.openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: chunks,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Embedding generation timeout')), this.TIMEOUT)
        )
      ]);
      return response.data.map(item => item.embedding);
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        console.log(`Retry attempt ${retryCount + 1} for embedding generation`);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return this.generateEmbeddingsBatch(chunks, retryCount + 1);
      }
      console.error('Error generating embeddings batch:', error);
      throw error;
    }
  }

  async generateEmbeddings(documents, onProgress) {
    try {
      const embeddings = [];
      let processedDocs = 0;
      let totalChunks = 0;
      let processedChunks = 0;
      let failedChunks = [];

      // First, chunk all documents and count total chunks
      const documentChunks = await Promise.all(documents.map(async doc => {
        onProgress('log', `Processing document: ${doc.originalname}`);
        const content = await fs.readFile(doc.path, 'utf-8');
        const chunks = splitIntoChunks(content, 500); // Reduce chunk size for better reliability
        totalChunks += chunks.length;
        return {
          chunks,
          metadata: {
            title: doc.originalname,
            type: doc.mimetype
          }
        };
      }));

      // Process chunks in batches
      for (const doc of documentChunks) {
        const chunks = doc.chunks;
        const batchCount = Math.ceil(chunks.length / this.BATCH_SIZE);
        
        for (let i = 0; i < batchCount; i++) {
          const startIdx = i * this.BATCH_SIZE;
          const endIdx = Math.min(startIdx + this.BATCH_SIZE, chunks.length);
          const batchChunks = chunks.slice(startIdx, endIdx);

          onProgress('log', `Processing batch ${i + 1}/${batchCount} for ${doc.metadata.title}`);
          
          try {
            const embedBatch = await this.generateEmbeddingsBatch(batchChunks);

            batchChunks.forEach((chunk, idx) => {
              embeddings.push({
                content: chunk,
                embedding: embedBatch[idx],
                metadata: {
                  ...doc.metadata,
                  chunk: processedChunks + idx + 1,
                  totalChunks
                }
              });
            });

            processedChunks += batchChunks.length;
          } catch (error) {
            onProgress('log', `Failed to process batch ${i + 1}. Will retry later: ${error.message}`);
            failedChunks.push({
              chunks: batchChunks,
              metadata: doc.metadata,
              batchNumber: i + 1
            });
          }

          const progress = Math.round((processedChunks / totalChunks) * 100);
          onProgress('status', `Processed ${processedChunks}/${totalChunks} chunks`, progress);
          
          // Add a small delay between batches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        processedDocs++;
        await fs.unlink(documents[processedDocs - 1].path); // Clean up processed file
      }

      // Retry failed chunks
      if (failedChunks.length > 0) {
        onProgress('log', `Retrying ${failedChunks.length} failed batches...`);
        for (const failed of failedChunks) {
          try {
            onProgress('log', `Retrying batch ${failed.batchNumber} for ${failed.metadata.title}`);
            const embedBatch = await this.generateEmbeddingsBatch(failed.chunks);

            failed.chunks.forEach((chunk, idx) => {
              embeddings.push({
                content: chunk,
                embedding: embedBatch[idx],
                metadata: {
                  ...failed.metadata,
                  chunk: processedChunks + idx + 1,
                  totalChunks
                }
              });
            });

            processedChunks += failed.chunks.length;
            const progress = Math.round((processedChunks / totalChunks) * 100);
            onProgress('status', `Processed ${processedChunks}/${totalChunks} chunks`, progress);
          } catch (error) {
            onProgress('log', `Failed to process batch ${failed.batchNumber} after retries: ${error.message}`);
          }
          
          // Add a longer delay between retry attempts
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      return embeddings;
    } catch (error) {
      // Clean up temporary files on error
      await Promise.all(documents.map(doc => fs.unlink(doc.path).catch(() => {})));
      throw error;
    }
  }

  async storeEmbeddings(vectorDB, embeddings, onProgress) {
    try {
      const totalBatches = Math.ceil(embeddings.length / this.BATCH_SIZE);
      
      for (let i = 0; i < embeddings.length; i += this.BATCH_SIZE) {
        const batch = embeddings.slice(i, i + this.BATCH_SIZE);
        const currentBatch = Math.floor(i / this.BATCH_SIZE) + 1;
        
        onProgress('log', `Storing batch ${currentBatch}/${totalBatches} in vector database`);
        
        if (vectorDB instanceof ChromaClient) {
          const collection = await vectorDB.getOrCreateCollection('documents');
          await collection.add({
            ids: batch.map((_, idx) => `doc-${i + idx}`),
            embeddings: batch.map(e => e.embedding),
            documents: batch.map(e => e.content),
            metadatas: batch.map(e => e.metadata)
          });
        } else if (vectorDB instanceof PineconeClient) {
          const index = await vectorDB.Index('documents');
          await index.upsert({
            vectors: batch.map((e, idx) => ({
              id: `doc-${i + idx}`,
              values: e.embedding,
              metadata: { ...e.metadata, content: e.content }
            }))
          });
        }

        const progress = Math.round(((currentBatch) / totalBatches) * 100);
        onProgress('status', `Stored ${currentBatch * this.BATCH_SIZE}/${embeddings.length} embeddings`, progress);
      }
    } catch (error) {
      onProgress('log', `Error storing embeddings: ${error.message}`);
      throw error;
    }
  }

  async searchVectorDB(vectorDB, queryEmbedding) {
    try {
      switch (vectorDB.constructor.name) {
        case 'ChromaClient':
          const collection = await vectorDB.getCollection('documents');
          const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 3
          });
          return results.documents[0].map((doc, i) => ({
            content: doc,
            metadata: results.metadatas[0][i],
            score: results.distances[0][i]
          }));

        case 'PineconeClient':
          const index = await vectorDB.Index('documents');
          const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: 3,
            includeMetadata: true
          });
          return queryResponse.matches.map(match => ({
            content: match.metadata.content,
            metadata: match.metadata,
            score: match.score
          }));

        default:
          throw new Error('Unsupported vector database type');
      }
    } catch (error) {
      console.error('Error searching vector DB:', error);
      throw error;
    }
  }

  async generateAnswer(query, context) {
    try {
      // Select most relevant chunks, limited to avoid token limit
      const relevantContext = context
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(c => c.content)
        .join('\n\n');

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that answers questions based on the provided context. If the answer cannot be found in the context, say so."
          },
          {
            role: "user",
            content: `Context:\n${relevantContext}\n\nQuestion: ${query}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating answer:', error);
      throw error;
    }
  }

  async deployContainer(deploymentId, config, onProgress) {
    try {
      const deployDir = path.join(__dirname, '../deployments', deploymentId);
      
      // Log directory creation
      onProgress('log', `Creating deployment directory: ${deployDir}`);
      await fs.mkdir(deployDir, { recursive: true });

      // Copy Dockerfile and requirements
      onProgress('log', 'Copying Dockerfile and requirements...');
      await fs.copyFile(
        path.join(__dirname, '../templates/rag/Dockerfile'),
        path.join(deployDir, 'Dockerfile')
      );
      await fs.copyFile(
        path.join(__dirname, '../templates/rag/requirements.txt'),
        path.join(deployDir, 'requirements.txt')
      );

      // Save config
      onProgress('log', 'Saving configuration...');
      await fs.writeFile(
        path.join(deployDir, 'config.json'),
        JSON.stringify(config, null, 2)
      );

      // Build and run Docker container
      const containerName = `rag-agent-${deploymentId}`;
      onProgress('log', `Building Docker image: ${containerName}`);
      const { stdout: buildOutput } = await execAsync(`docker build -t ${containerName} ${deployDir}`);
      onProgress('log', buildOutput);

      onProgress('log', `Starting Docker container: ${containerName}`);
      const { stdout: runOutput } = await execAsync(
        `docker run -d --name ${containerName} \
        -p 5000:5000 \
        -e OPENAI_API_KEY=${process.env.OPENAI_API_KEY} \
        -v ${deployDir}:/app/data \
        ${containerName}`
      );
      onProgress('log', `Container started with ID: ${runOutput.trim()}`);

      return true;
    } catch (error) {
      onProgress('log', `Error deploying container: ${error.message}`);
      throw error;
    }
  }

  async ensureChromaDBConnection() {
    try {
      await this.chromaClient.heartbeat();
      return true;
    } catch (error) {
      console.error('ChromaDB connection error:', error);
      return false;
    }
  }

  async initializeVectorDB(type, config) {
    try {
      switch (type) {
        case 'chroma': {
          // Ensure ChromaDB is accessible
          await this.ensureChromaDBConnection();

          // Get or create collection with proper error handling
          try {
            const collection = await this.chromaClient.getOrCreateCollection({
              name: config.collectionName || 'documents',
              metadata: config.metadata || {},
            });
            
            console.log('Successfully initialized ChromaDB collection:', collection.name);
            return collection;
          } catch (error) {
            console.error('Error creating ChromaDB collection:', error);
            if (error.message.includes('already exists')) {
              // Try to get existing collection
              return await this.chromaClient.getCollection({
                name: config.collectionName || 'documents'
              });
            }
            throw error;
          }
        }
        case 'pinecone':
          const pinecone = new PineconeClient();
          await pinecone.init({
            environment: config.environment,
            apiKey: config.apiKey
          });
          return pinecone;

        default:
          throw new Error(`Unsupported vector database: ${type}`);
      }
    } catch (error) {
      console.error('Error initializing vector database:', error);
      throw new Error(`Failed to initialize ${type}: ${error.message}`);
    }
  }

  async deployRAGAgent(documents, vectorDBType, config, onProgress) {
    try {
      const deploymentId = `rag-${Date.now()}`;
      
      onProgress('status', 'Creating deployment directory...', 20);
      onProgress('log', `Starting deployment with ID: ${deploymentId}`);

      const deployDir = path.join(__dirname, '../deployments', deploymentId);
      await fs.mkdir(deployDir, { recursive: true });

      onProgress('status', 'Initializing vector database...', 30);
      onProgress('log', `Initializing ${vectorDBType} database...`);
      const vectorDB = await this.initializeVectorDB(vectorDBType, config);

      onProgress('status', 'Processing documents...', 40);
      const embeddings = await this.generateEmbeddings(documents, (type, message, progress) => {
        if (type === 'status') {
          const overallProgress = 40 + (progress * 0.3); // 30% of total progress
          onProgress('status', message, overallProgress);
        } else {
          onProgress(type, message);
        }
      });

      onProgress('status', 'Storing embeddings...', 70);
      await this.storeEmbeddings(vectorDB, embeddings, (type, message, progress) => {
        if (type === 'status') {
          const overallProgress = 70 + (progress * 0.2); // 20% of total progress
          onProgress('status', message, overallProgress);
        } else {
          onProgress(type, message);
        }
      });

      onProgress('status', 'Deploying Docker container...', 80);
      await this.deployContainer(deploymentId, {
        vectorDBType,
        config
      }, (message) => onProgress('log', message));

      onProgress('status', 'Finalizing deployment...', 90);
      this.deployments.set(deploymentId, {
        vectorDB,
        config,
        status: 'running'
      });

      return {
        id: deploymentId,
        status: 'running',
        endpoint: `http://localhost:5000/rag/${deploymentId}`
      };
    } catch (error) {
      onProgress('log', `Deployment failed: ${error.message}`);
      throw error;
    }
  }

  async query(deploymentId, query) {
    try {
      const deployment = this.deployments.get(deploymentId);
      if (!deployment) {
        throw new Error('Deployment not found');
      }

      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query);

      // Search vector DB
      const results = await this.searchVectorDB(
        deployment.vectorDB,
        queryEmbedding
      );

      // Generate answer using OpenAI
      const answer = await this.generateAnswer(query, results);

      return {
        answer,
        sources: results.map(r => ({
          title: r.metadata.title,
          relevance: Math.round(r.score * 100)
        }))
      };
    } catch (error) {
      console.error('RAG query error:', error);
      throw error;
    }
  }
}

module.exports = new RAGService(); 