const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const search = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  for (const col of collections) {
    const data = await db.collection(col.name).find({}).toArray();
    for (const doc of data) {
      const str = JSON.stringify(doc);
      if (str.includes('2.png') || str.includes('2.webp')) {
        console.log(`Found in ${col.name}:`, doc._id);
        Object.keys(doc).forEach(key => {
          if (typeof doc[key] === 'string' && (doc[key].includes('2.png') || doc[key].includes('2.webp'))) {
            console.log(`  Field ${key}: ${doc[key]}`);
          }
        });
      }
    }
  }
  process.exit();
};

search();
