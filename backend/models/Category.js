const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store URL/path to the image
  },
  meta_title: {
    type: String,
    maxlength: 255,
  },
  meta_description: {
    type: String,
  },
  meta_keywords: {
    type: String,
    maxlength: 255,
  }
}, {
  timestamps: true
});

// Index for faster queries
categorySchema.index({ title: 1 });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
