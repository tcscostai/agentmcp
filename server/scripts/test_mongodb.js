const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://saurabhdubeyaws:macpro123@cluster0.mrawwvb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "healthcare";
const COLLECTION_NAME = "csnp_members";

async function testConnection() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Count documents
    const count = await collection.countDocuments();
    console.log(`Total documents in collection: ${count}`);

    // Get a sample document
    const sample = await collection.findOne({});
    console.log('Sample document:', sample);

    await client.close();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function testMemberDocuments() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Test Ruth's documents
    const ruth = await collection.findOne({ memberId: 'CSNP749117' });
    console.log('Ruth\'s document verification status:', {
      memberId: ruth.memberId,
      name: ruth.name,
      documents: ruth.eligibilityDocuments.map(doc => ({
        type: doc.type,
        verified: doc.verified
      }))
    });

    // Test Sarah's documents
    const sarah = await collection.findOne({ memberId: 'CSNP888999' });
    console.log('Sarah\'s document verification status:', {
      memberId: sarah.memberId,
      name: sarah.name,
      documents: sarah.eligibilityDocuments.map(doc => ({
        type: doc.type,
        verified: doc.verified
      }))
    });

    await client.close();
  } catch (error) {
    console.error('Test error:', error);
  }
}

testConnection();
testMemberDocuments(); 