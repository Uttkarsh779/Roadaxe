const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const path = require('path');
const AppError = require('../utils/appError');

// Set storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the resource type based on file extension
    const isDocument = /\.(pdf|doc|docx)$/i.test(file.originalname);
    return {
      folder: 'roadx',
      format: undefined, // Let cloudinary handle the format from the original file
      public_id: `${file.fieldname}-${Date.now()}`,
      resource_type: isDocument ? 'raw' : 'auto' // Use auto for images/video, raw for docs
    };
  }
});



// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'brochure') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new AppError('Only PDF files are allowed for the brochure!', 400), false);
      }
    } else {
      // Allow images for other fields
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new AppError('Only image files are allowed!', 400), false);
      }
    }
  }
});

module.exports = upload;
