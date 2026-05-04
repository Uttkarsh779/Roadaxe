const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Product = require('../models/Product');
const Article = require('../models/Article');
const Testimonial = require('../models/Testimonial');
const Employee = require('../models/Employee');

const mediaRoot = 'd:/Roadx_test/roadx/media';

const audit = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roadx');
  console.log('Connected to MongoDB for Audit');

  const report = {
    missing: [],
    fixed: 0,
    total: 0
  };

  const checkAndLog = (doc, field, type) => {
    const val = doc[field];
    if (!val) return;
    report.total++;
    
    const relativePath = val.replace(/^uploads\//, '');
    const fullPath = path.join(mediaRoot, relativePath);

    if (!fs.existsSync(fullPath)) {
      report.missing.push({
        type,
        id: doc._id,
        field,
        path: val,
        expectedAbs: fullPath
      });
    }
  };

  // Audit Products
  const products = await Product.find();
  products.forEach(p => {
    checkAndLog(p, 'image', 'Product');
    for(let i=1; i<=6; i++) {
      checkAndLog(p, `highlight_${i}_icon`, 'Product Highlight');
    }
  });

  // Audit Articles
  const articles = await Article.find();
  articles.forEach(a => {
    checkAndLog(a, 'banner_image', 'Article');
    checkAndLog(a, 'thumbnail_image', 'Article');
  });

  // Audit Testimonials
  const testimonials = await Testimonial.find();
  testimonials.forEach(t => {
    checkAndLog(t, 'image', 'Testimonial');
  });

  // Audit Employees
  const employees = await Employee.find();
  employees.forEach(e => {
    checkAndLog(e, 'image', 'Employee');
  });

  console.log('\n--- IMAGE AUDIT REPORT ---');
  console.log(`Total Image Fields Checked: ${report.total}`);
  console.log(`Missing Files: ${report.missing.length}`);
  
  if (report.missing.length > 0) {
    console.log('\nSample Missing Files:');
    report.missing.slice(0, 10).forEach(m => {
      console.log(`[${m.type}] ID:${m.id} Field:${m.field} Path:${m.path}`);
    });
  }

  process.exit();
};

audit();
