const mongoose = require('mongoose');
const Product = require('../models/Product');
const { deleteFromCloudinary } = require('../utils/cloudinaryCleanup');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testDeleteFlow = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // Create a dummy product with a real Cloudinary URL from the mapping (just for testing deletion logic)
  const mapping = require('./static_media_mapping.json');
  const testUrl = mapping["/static/assets/main/img/4.webp"];
  
  console.log('Creating test product with image:', testUrl);
  const product = await Product.create({
    name: 'Test Deletion Product',
    category: 'E-Rickshaw',
    image: testUrl
  });

  console.log('Deleting product and verifying cleanup call...');
  const prodToDelete = await Product.findById(product._id);
  if (prodToDelete.image) {
    console.log('Simulating deletion of Cloudinary asset:', prodToDelete.image);
    await deleteFromCloudinary(prodToDelete.image);
  }
  await Product.findByIdAndDelete(product._id);
  console.log('Test product deleted from DB');

  process.exit(0);
};

testDeleteFlow();
