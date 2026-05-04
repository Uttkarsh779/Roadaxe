const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 255 },
  meta_title: { type: String, maxlength: 255 },
  meta_description: { type: String },
  meta_keywords: { type: String },
  description: { type: String },
  content: { type: String, required: true }, // RichText stored as string
  banner_image: { type: String },
  thumbnail_image: { type: String },
}, {
  timestamps: true
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
