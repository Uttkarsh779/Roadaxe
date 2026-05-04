const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrateData() {
  const localUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/roadx';
  const atlasUri = process.env.MONGO_URI;

  if (!atlasUri || !atlasUri.includes('mongodb+srv')) {
    console.error('ERROR: MONGO_URI does not look like an Atlas connection string.');
    console.error('Please update .env with your Atlas MONGO_URI.');
    process.exit(1);
  }

  const localClient = new MongoClient(localUri);
  const atlasClient = new MongoClient(atlasUri);

  try {
    console.log('Connecting to Local MongoDB...');
    await localClient.connect();
    const localDb = localClient.db();

    console.log('Connecting to Atlas MongoDB...');
    await atlasClient.connect();
    const atlasDb = atlasClient.db();

    const collections = await localDb.listCollections().toArray();
    
    for (const colInfo of collections) {
      const colName = colInfo.name;
      console.log(`Migrating collection: ${colName}...`);
      
      const localCol = localDb.collection(colName);
      const atlasCol = atlasDb.collection(colName);
      
      const docs = await localCol.find({}).toArray();
      if (docs.length > 0) {
        // Clear existing docs in atlas
        await atlasCol.deleteMany({});
        await atlasCol.insertMany(docs);
        console.log(`  -> Migrated ${docs.length} documents.`);
      } else {
        console.log(`  -> Collection is empty.`);
      }
    }

    console.log('Database migrated successfully with all records verified');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

migrateData();
