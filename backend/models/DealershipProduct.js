const mongoose = require('mongoose');

const dealershipProductSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  category: { type: String, required: true, maxlength: 255 },
  description: { type: String, required: true },
  gst_percentage: { type: Number, required: true },
  hsn_code: { type: String, required: true, maxlength: 15 },
  price: { type: Number, required: true },
}, {
  timestamps: true
});

const DealershipProduct = mongoose.model('DealershipProduct', dealershipProductSchema);
module.exports = DealershipProduct;
