const mongoose = require('mongoose');
const Product = require('../models/Product');
const Article = require('../models/Article');
const Employee = require('../models/Employee');
const Testimonial = require('../models/Testimonial');
const JobApplication = require('../models/JobApplication');
const DealershipRequest = require('../models/DealershipRequest');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const isLocal = (url) => {
  if (!url) return false;
  return url.includes('uploads/') || url.includes('/media/') || !url.startsWith('http');
};

const isCloudinary = (url) => {
  if (!url) return false;
  return url.includes('res.cloudinary.com');
};

const auditImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    let totalScanned = 0;
    let migrated = 0;
    let notMigrated = 0;

    const checkDocs = async (Model, fields) => {
      const docs = await Model.find({});
      for (const doc of docs) {
        for (const field of fields) {
          if (doc[field]) {
            totalScanned++;
            if (isCloudinary(doc[field])) {
              migrated++;
            } else if (isLocal(doc[field])) {
              notMigrated++;
              console.log(`[LOCAL] ${Model.modelName} id:${doc._id} field:${field} -> ${doc[field]}`);
            }
          }
        }
      }
    };

    await checkDocs(Product, ['image', 'banner_image', 'thumbnail_image']);
    await checkDocs(Article, ['image', 'banner_image', 'thumbnail_image']);
    await checkDocs(Employee, ['image']);
    await checkDocs(Testimonial, ['image']);
    await checkDocs(JobApplication, ['resume']);
    await checkDocs(DealershipRequest, ['document']);

    console.log('\n--- AUDIT RESULTS ---');
    console.log(`Total images scanned: ${totalScanned}`);
    console.log(`Migrated to Cloudinary: ${migrated}`);
    console.log(`Remaining local/static: ${notMigrated}`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

auditImages();
