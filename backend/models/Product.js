const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  subcategory: { type: String, maxlength: 255 },
  category: { type: String, required: true, maxlength: 255 },
  meta_title: { type: String, required: true, maxlength: 255 },
  meta_description: { type: String, required: true },
  meta_keywords: { type: String, required: true, maxlength: 255 },
  image: { type: String, required: true },
  
  // Highlights
  highlight_1: { type: String, maxlength: 255 },
  highlight_1_icon: { type: String },
  highlight_2: { type: String, maxlength: 255 },
  highlight_2_icon: { type: String },
  highlight_3: { type: String, maxlength: 255 },
  highlight_3_icon: { type: String },
  highlight_4: { type: String, maxlength: 255 },
  highlight_4_icon: { type: String },
  highlight_5: { type: String, maxlength: 255 },
  highlight_5_icon: { type: String },
  highlight_6: { type: String, maxlength: 255 },
  highlight_6_icon: { type: String },

  // Specs
  spec1: { type: String, maxlength: 255, default: ' ' },
  spec1ans: { type: String, maxlength: 255, default: ' ' },
  spec2: { type: String, maxlength: 255, default: ' ' },
  spec2ans: { type: String, maxlength: 255, default: ' ' },
  spec3: { type: String, maxlength: 255, default: ' ' },
  spec3ans: { type: String, maxlength: 255, default: ' ' },
  spec4: { type: String, maxlength: 255, default: ' ' },
  spec4ans: { type: String, maxlength: 255, default: ' ' },
  spec5: { type: String, maxlength: 255, default: ' ' },
  spec5ans: { type: String, maxlength: 255, default: ' ' },
  spec6: { type: String, maxlength: 255, default: ' ' },
  spec6ans: { type: String, maxlength: 255, default: ' ' },
  spec7: { type: String, maxlength: 255, default: ' ' },
  spec7ans: { type: String, maxlength: 255, default: ' ' },
  spec8: { type: String, maxlength: 255, default: ' ' },
  spec8ans: { type: String, maxlength: 255, default: ' ' },
  spec9: { type: String, maxlength: 255, default: ' ' },
  spec9ans: { type: String, maxlength: 255, default: ' ' },
  spec10: { type: String, maxlength: 255, default: ' ' },
  spec10ans: { type: String, maxlength: 255, default: ' ' },

  description: { type: String, required: true },
  booking_price: { type: Number, required: true }, // Mongoose uses Number for Decimal
  actual_price: { type: Number, required: true },
  brochure: { type: String },
}, {
  timestamps: true
});

// Indexes for common queries
productSchema.index({ category: 1 });
productSchema.index({ name: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
