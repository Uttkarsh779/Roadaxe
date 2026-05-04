const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Article = require('../models/Article');
const Employee = require('../models/Employee');
const Testimonial = require('../models/Testimonial');
const JobApplication = require('../models/JobApplication');
const DealershipRequest = require('../models/DealershipRequest');
const Category = require('../models/Category');

const isLocal = (url) => {
  if (!url) return false;
  return url.includes('uploads/') || url.includes('/media/') || (!url.startsWith('http') && url.length > 0);
};

const isCloudinary = (url) => {
  if (!url) return false;
  return url.includes('res.cloudinary.com');
};

const fullAudit = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const results = {
      Products: { total: 0, migrated: 0, local: 0 },
      Articles: { total: 0, migrated: 0, local: 0 },
      Employees: { total: 0, migrated: 0, local: 0 },
      Testimonials: { total: 0, migrated: 0, local: 0 },
      Categories: { total: 0, migrated: 0, local: 0 },
      JobApps: { total: 0, migrated: 0, local: 0 },
      DealerRequests: { total: 0, migrated: 0, local: 0 },
    };

    const checkDocs = async (Model, fields, key) => {
      const docs = await Model.find({});
      for (const doc of docs) {
        for (const field of fields) {
          if (doc[field]) {
            results[key].total++;
            if (isCloudinary(doc[field])) {
              results[key].migrated++;
            } else if (isLocal(doc[field])) {
              results[key].local++;
              console.log(`[LOCAL] ${key} - ID:${doc._id} - Field:${field}: ${doc[field]}`);
            }
          }
        }
      }
    };

    await checkDocs(Product, ['image', 'highlight_1_icon', 'highlight_2_icon', 'highlight_3_icon', 'highlight_4_icon', 'highlight_5_icon', 'highlight_6_icon'], 'Products');
    await checkDocs(Article, ['image', 'banner_image', 'thumbnail_image'], 'Articles');
    await checkDocs(Employee, ['image'], 'Employees');
    await checkDocs(Testimonial, ['image'], 'Testimonials');
    await checkDocs(Category, ['image'], 'Categories');
    await checkDocs(JobApplication, ['resume'], 'JobApps');
    await checkDocs(DealershipRequest, ['document'], 'DealerRequests');

    console.log('\n--- FULL MEDIA AUDIT RESULTS ---');
    Object.keys(results).forEach(key => {
      console.log(`${key}: Total:${results[key].total} | Migrated:${results[key].migrated} | Local:${results[key].local}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fullAudit();
