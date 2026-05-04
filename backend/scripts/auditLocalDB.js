const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const auditDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  let localFound = 0;

  for (const col of collections) {
    const data = await db.collection(col.name).find({}).toArray();
    for (const doc of data) {
      Object.keys(doc).forEach(key => {
        const val = doc[key];
        if (typeof val === 'string' && (val.includes('uploads/') || val.includes('media/') || val.startsWith('/static/'))) {
          if (!val.includes('cloudinary.com')) {
            console.log(`[LOCAL PATH FOUND] Collection: ${col.name}, ID: ${doc._id}, Field: ${key}, Value: ${val}`);
            localFound++;
          }
        }
      });
    }
  }
  
  console.log(`\nAudit complete. Total local references found: ${localFound}`);
  process.exit();
};

auditDB();
