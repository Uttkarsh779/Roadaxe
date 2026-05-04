const cloudinary = require('../utils/cloudinary');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testUpload = async () => {
  const filePath = 'd:\\Roadx_test\\roadx\\static\\assets\\main\\img\\4.webp';
  console.log('Testing upload for:', filePath);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'roadx/test'
    });
    console.log('Success:', result.secure_url);
  } catch (err) {
    console.error('Error:', err);
  }
};

testUpload();
