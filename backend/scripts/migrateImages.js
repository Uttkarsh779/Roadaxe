const mongoose = require('mongoose');
const Product = require('../models/Product');
const Article = require('../models/Article');
const Employee = require('../models/Employee');
const Testimonial = require('../models/Testimonial');
const JobApplication = require('../models/JobApplication');
const DealershipRequest = require('../models/DealershipRequest');
const Category = require('../models/Category');
const path = require('path');
const dotenv = require('dotenv');
const envPath = path.join(__dirname, '../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');

const cloudinary = require('../utils/cloudinary');

// Local Django media folder: d:\Roadx_test\roadx\media\
// __dirname = d:\Roadx_test\roadx\backend\scripts
// media is at: d:\Roadx_test\roadx\media (sibling of backend)
const DJANGO_MEDIA_ROOT = path.resolve(__dirname, '..', '..', 'media');

const isCloudinary = (url) => url && url.includes('res.cloudinary.com');

/**
 * Given a DB path like "uploads/products/Roadx_E-Passenger_EV.webp"
 * OR "uploads/articles/banner_images/1.png"
 * map it to the local Django media folder structure.
 *
 * Django stores: media/products/Roadx_E-Passenger_EV.webp
 * DB stores:     uploads/products/Roadx_E-Passenger_EV.webp
 * So we strip the "uploads/" prefix and look inside media/
 */
const resolveLocalPath = (relPath) => {
  // strip leading "uploads/" if present
  const stripped = relPath.replace(/^uploads\//, '');
  return path.join(DJANGO_MEDIA_ROOT, stripped);
};

const uploadFromLocal = async (relPath, folder) => {
  const localPath = resolveLocalPath(relPath);
  const fs = require('fs');
  if (!fs.existsSync(localPath)) {
    console.error(`  NOT FOUND: ${localPath}`);
    return null;
  }
  console.log(`  Uploading from: ${localPath}`);
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: `roadx/${folder}`,
      use_filename: true,
      unique_filename: false,
      overwrite: false
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  FAILED:`, err.http_code || err.message || err);
    return null;
  }
};

const migrateAll = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to Atlas MongoDB...\n');

  let totalScanned = 0;
  let alreadyMigrated = 0;
  let successfulUploads = 0;
  let failedUploads = 0;

  // ─── Products ───────────────────────────────────────────────────────────────
  const products = await Product.find({});
  console.log(`\n=== PRODUCTS (${products.length}) ===`);
  for (const doc of products) {
    let docUpdated = false;
    const fields = ['image', 'highlight_1_icon', 'highlight_2_icon', 'highlight_3_icon', 'highlight_4_icon', 'highlight_5_icon', 'highlight_6_icon'];
    for (const field of fields) {
      if (!doc[field]) continue;
      totalScanned++;
      if (isCloudinary(doc[field])) { alreadyMigrated++; continue; }

      console.log(`[PRODUCT] ${doc.name} - field: ${field}`);
      const url = await uploadFromLocal(doc[field], 'products');
      if (url) {
        doc[field] = url;
        docUpdated = true;
        successfulUploads++;
        console.log(`  ✅ Done`);
      } else {
        failedUploads++;
      }
    }
    if (docUpdated) await doc.save();
  }

  // ─── Categories ──────────────────────────────────────────────────────────────
  const categories = await Category.find({});
  console.log(`\n=== CATEGORIES (${categories.length}) ===`);
  for (const doc of categories) {
    if (!doc.image) continue;
    totalScanned++;
    if (isCloudinary(doc.image)) { alreadyMigrated++; continue; }

    console.log(`[CATEGORY] ${doc.title}`);
    const url = await uploadFromLocal(doc.image, 'categories');
    if (url) {
      doc.image = url;
      await doc.save();
      successfulUploads++;
      console.log(`  ✅ Done`);
    } else {
      failedUploads++;
    }
  }

  // ─── Articles ────────────────────────────────────────────────────────────────
  const articles = await Article.find({});
  console.log(`\n=== ARTICLES (${articles.length}) ===`);
  for (const doc of articles) {
    for (const field of ['image', 'banner_image', 'thumbnail_image']) {
      if (!doc[field]) continue;
      totalScanned++;
      if (isCloudinary(doc[field])) { alreadyMigrated++; continue; }

      console.log(`[ARTICLE] ${doc.title || doc._id} - field: ${field}`);
      const url = await uploadFromLocal(doc[field], 'articles');
      if (url) {
        doc[field] = url;
        await doc.save();
        successfulUploads++;
        console.log(`  ✅ Done`);
      } else {
        failedUploads++;
      }
    }
  }

  // ─── Employees ──────────────────────────────────────────────────────────────
  const employees = await Employee.find({});
  console.log(`\n=== EMPLOYEES (${employees.length}) ===`);
  for (const doc of employees) {
    if (!doc.image) continue;
    totalScanned++;
    if (isCloudinary(doc.image)) { alreadyMigrated++; continue; }

    console.log(`[EMPLOYEE] ${doc.name}`);
    const url = await uploadFromLocal(doc.image, 'employees');
    if (url) {
      doc.image = url;
      await doc.save();
      successfulUploads++;
      console.log(`  ✅ Done`);
    } else {
      failedUploads++;
    }
  }

  // ─── Testimonials ────────────────────────────────────────────────────────────
  const testimonials = await Testimonial.find({});
  console.log(`\n=== TESTIMONIALS (${testimonials.length}) ===`);
  for (const doc of testimonials) {
    if (!doc.image) continue;
    totalScanned++;
    if (isCloudinary(doc.image)) { alreadyMigrated++; continue; }

    console.log(`[TESTIMONIAL] ${doc._id}`);
    const url = await uploadFromLocal(doc.image, 'testimonials');
    if (url) {
      doc.image = url;
      await doc.save();
      successfulUploads++;
      console.log(`  ✅ Done`);
    } else {
      failedUploads++;
    }
  }

  // ─── Job Applications ────────────────────────────────────────────────────────
  const jobApps = await JobApplication.find({});
  for (const doc of jobApps) {
    if (!doc.resume || isCloudinary(doc.resume)) continue;
    totalScanned++;
    const url = await uploadFromLocal(doc.resume, 'resumes');
    if (url) { doc.resume = url; await doc.save(); successfulUploads++; }
    else failedUploads++;
  }

  // ─── Dealership Requests ─────────────────────────────────────────────────────
  const dealers = await DealershipRequest.find({});
  for (const doc of dealers) {
    if (!doc.document || isCloudinary(doc.document)) continue;
    totalScanned++;
    const url = await uploadFromLocal(doc.document, 'documents');
    if (url) { doc.document = url; await doc.save(); successfulUploads++; }
    else failedUploads++;
  }

  console.log('\n\n--- MIGRATION SUMMARY ---');
  console.log(`Total images scanned:      ${totalScanned}`);
  console.log(`Already on Cloudinary:     ${alreadyMigrated}`);
  console.log(`Successfully migrated:     ${successfulUploads}`);
  console.log(`Failed (check URLs):       ${failedUploads}`);

  if (failedUploads === 0) {
    console.log('\n✅ ALL IMAGES NOW SERVED FROM CLOUDINARY');
  } else {
    console.log('\n⚠️  Some images could not be migrated. Check if they exist at roadx.in/media/');
  }

  process.exit(0);
};

migrateAll().catch(err => { console.error(err); process.exit(1); });
