const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import Mongoose Models
const Category = require('./models/Category');
const Product = require('./models/Product');
const Article = require('./models/Article');
const Testimonial = require('./models/Testimonial');
const Employee = require('./models/Employee');
const Enquiry = require('./models/Enquiry');
const DealerEnquiry = require('./models/DealerEnquiry');
const Order = require('./models/Order');
const DealershipProduct = require('./models/DealershipProduct');
const DealershipOrder = require('./models/DealershipOrder');
const Quotation = require('./models/Quotation');
const User = require('./models/User');

const DRY_RUN = process.argv.includes('--dry-run');

// ID Mapping System
// We will track Django PK to Mongoose ObjectId to preserve relationships
const idMap = {
  category: {},
  product: {},
};

const migrationSummary = {
  success: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

// Helper to format image paths (Django /media/xxx -> Mongoose uploads/xxx)
const transformImage = (imagePath) => {
  if (!imagePath) return '';
  return `uploads/${imagePath}`;
};

const mapObject = (djangoItem, mappingConfig) => {
  const newObj = {};
  for (const [djangoField, mongoField] of Object.entries(mappingConfig.fields)) {
    let val = djangoItem.fields[djangoField];
    if (val !== null && val !== undefined) {
      if (mappingConfig.transformers && mappingConfig.transformers[djangoField]) {
        val = mappingConfig.transformers[djangoField](val);
      }
      newObj[mongoField] = val;
    }
  }
  return newObj;
};

const runMigration = async () => {
  console.log(`Starting Data Migration ${DRY_RUN ? '(DRY RUN)' : ''}...`);

  if (!DRY_RUN) {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roadx_mern');
      console.log('Connected to MongoDB.');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    }
  }

  // 1. Read dump file
  const dumpData = JSON.parse(fs.readFileSync('../django_dump.json', 'utf-8'));
  console.log(`Loaded ${dumpData.length} records from django_dump.json`);

  // Group by model
  const groupedData = dumpData.reduce((acc, item) => {
    acc[item.model] = acc[item.model] || [];
    acc[item.model].push(item);
    return acc;
  }, {});

  const insertData = async (Model, djangoModelName, mappingConfig) => {
    const records = groupedData[djangoModelName] || [];
    console.log(`\nMigrating ${djangoModelName} (${records.length} records) -> ${Model.modelName}`);

    for (const item of records) {
      try {
        const mappedData = mapObject(item, mappingConfig);
        
        // Add specific relational mappings if defined
        if (mappingConfig.relations) {
          mappingConfig.relations(item, mappedData);
        }

        if (!DRY_RUN) {
          // Check for duplication based on unique keys
          const query = {};
          if (mappingConfig.uniqueKeys) {
            for (const key of mappingConfig.uniqueKeys) {
              query[key] = mappedData[key];
            }
          }

          let existingRecord = null;
          if (Object.keys(query).length > 0) {
            existingRecord = await Model.findOne(query);
          }

          let newDoc;
          if (existingRecord) {
            console.log(`  [SKIPPED] ${Model.modelName} ${item.pk} already exists.`);
            migrationSummary.skipped++;
            newDoc = existingRecord;
          } else {
            newDoc = await Model.create(mappedData);
            console.log(`  [INSERTED] ${Model.modelName} ${item.pk} -> ${newDoc._id}`);
            migrationSummary.success++;
          }

          // Save to mapping dictionary for future relations
          if (mappingConfig.mapCollection) {
            idMap[mappingConfig.mapCollection][item.pk] = newDoc._id;
          }
        } else {
          // DRY RUN
          console.log(`  [DRY RUN] Would insert ${Model.modelName}:`, mappedData);
          if (mappingConfig.mapCollection) {
            // mock ID
            idMap[mappingConfig.mapCollection][item.pk] = `mock_id_${item.pk}`;
          }
          migrationSummary.success++;
        }
      } catch (err) {
        console.error(`  [ERROR] Failed to migrate ${djangoModelName} ${item.pk}`, err.message);
        migrationSummary.failed++;
        migrationSummary.errors.push({ model: djangoModelName, pk: item.pk, error: err.message });
      }
    }
  };

  // --- MAPPINGS ---
  
  // Categories
  await insertData(Category, 'dash.category', {
    mapCollection: 'category',
    uniqueKeys: ['title'],
    fields: {
      title: 'title',
      description: 'description',
      image: 'image',
      meta_title: 'meta_title',
      meta_description: 'meta_description',
      meta_keywords: 'meta_keywords'
    },
    transformers: {
      image: transformImage
    }
  });

  // Products
  await insertData(Product, 'dash.product', {
    mapCollection: 'product',
    uniqueKeys: ['name'],
    fields: {
      name: 'name',
      subcategory: 'subcategory',
      category: 'category', // String matching category? Django might use CharField here instead of FK
      meta_title: 'meta_title',
      meta_description: 'meta_description',
      meta_keywords: 'meta_keywords',
      image: 'image',
      highlight_1: 'highlight_1',
      highlight_1_icon: 'highlight_1_icon',
      highlight_2: 'highlight_2',
      highlight_2_icon: 'highlight_2_icon',
      highlight_3: 'highlight_3',
      highlight_3_icon: 'highlight_3_icon',
      highlight_4: 'highlight_4',
      highlight_4_icon: 'highlight_4_icon',
      highlight_5: 'highlight_5',
      highlight_5_icon: 'highlight_5_icon',
      highlight_6: 'highlight_6',
      highlight_6_icon: 'highlight_6_icon',
      spec1: 'spec1', spec1ans: 'spec1ans',
      spec2: 'spec2', spec2ans: 'spec2ans',
      spec3: 'spec3', spec3ans: 'spec3ans',
      spec4: 'spec4', spec4ans: 'spec4ans',
      spec5: 'spec5', spec5ans: 'spec5ans',
      spec6: 'spec6', spec6ans: 'spec6ans',
      spec7: 'spec7', spec7ans: 'spec7ans',
      spec8: 'spec8', spec8ans: 'spec8ans',
      spec9: 'spec9', spec9ans: 'spec9ans',
      spec10: 'spec10', spec10ans: 'spec10ans',
      description: 'description',
      booking_price: 'booking_price',
      actual_price: 'actual_price'
    },
    transformers: {
      image: transformImage,
      booking_price: Number,
      actual_price: Number,
      meta_keywords: (val) => val ? val.substring(0, 255) : val
    }
  });

  // Articles
  await insertData(Article, 'dash.article', {
    uniqueKeys: ['title'],
    fields: {
      title: 'title',
      meta_title: 'meta_title',
      meta_description: 'meta_description',
      meta_keywords: 'meta_keywords',
      description: 'description',
      content: 'content',
      banner_image: 'banner_image',
      thumbnail_image: 'thumbnail_image'
    },
    transformers: {
      banner_image: transformImage,
      thumbnail_image: transformImage
    }
  });

  // Testimonials
  await insertData(Testimonial, 'dash.testimonial', {
    uniqueKeys: ['name', 'review'],
    fields: {
      name: 'name',
      image: 'image',
      designation: 'designation',
      review: 'review',
      stars: 'stars'
    },
    transformers: {
      image: transformImage
    }
  });

  // Employees
  await insertData(Employee, 'dash.employee', {
    uniqueKeys: ['name'],
    fields: {
      name: 'name',
      image: 'image',
      designation: 'designation',
      instagram_link: 'instagram_link',
      linkedin_link: 'linkedin_link',
      x_link: 'x_link',
      facebook_link: 'facebook_link'
    },
    transformers: {
      image: transformImage
    }
  });

  // Enquiries
  await insertData(Enquiry, 'dash.enquiry', {
    uniqueKeys: ['email', 'message'],
    fields: {
      name: 'name',
      email: 'email',
      phone_number: 'phone_number',
      subject: 'subject',
      message: 'message',
      status: 'status'
    }
  });

  // Dealership Enquiries
  await insertData(DealerEnquiry, 'dash.dealershipenqy', {
    uniqueKeys: ['email', 'phone_number'],
    fields: {
      name: 'name',
      email: 'email',
      phone_number: 'phone_number',
      pincode: 'pincode',
      address: 'address',
      status: 'status'
    }
  });

  // Dealership Products
  await insertData(DealershipProduct, 'dash.dealershipproduct', {
    uniqueKeys: ['name'],
    fields: {
      name: 'name',
      category: 'category',
      description: 'description',
      gst_percentage: 'gst_percentage',
      hsn_code: 'hsn_code',
      price: 'price'
    },
    transformers: {
      price: Number,
      gst_percentage: Number
    }
  });

  // Users (from auth.user)
  await insertData(User, 'auth.user', {
    uniqueKeys: ['username'],
    fields: {
      username: 'username',
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      password: 'password', // Will be skipped/overwritten by auth flows or stored hashed
      role: 'is_superuser'
    },
    transformers: {
      role: (val) => val ? 'admin' : 'customer'
    },
    relations: (djangoItem, mappedData) => {
      if (mappedData.email === '') {
        delete mappedData.email; // Prevent duplicate key on empty string
      }
      if (!mappedData.password) {
        mappedData.password = 'tempPassword123!';
      }
    }
  });


  console.log('\n==================================');
  console.log('MIGRATION SUMMARY');
  console.log('==================================');
  console.log(`Success: ${migrationSummary.success}`);
  console.log(`Skipped: ${migrationSummary.skipped}`);
  console.log(`Failed:  ${migrationSummary.failed}`);
  
  if (migrationSummary.errors.length > 0) {
    console.log('\nERRORS:');
    migrationSummary.errors.forEach(e => {
      console.log(`- ${e.model} PK:${e.pk} -> ${e.error}`);
    });
  }

  if (!DRY_RUN) {
    mongoose.connection.close();
  }
};

runMigration();
