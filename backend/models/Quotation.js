const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  // Company Details
  company_name: { type: String, maxlength: 255 },
  company_gstin: { type: String, maxlength: 15 },

  // Customer Details
  customer_name: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed to reference User
  email_id: { type: String, required: true },
  phone_number: { type: String, required: true, maxlength: 15 },

  // Address Details
  address_name: { type: String, required: true, maxlength: 255 },
  address: { type: String, required: true },
  pincode: { type: String, required: true, maxlength: 10 },
  city: { type: String, required: true, maxlength: 100 },
  state: { type: String, required: true, maxlength: 100 },

  // Product
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'DealershipProduct', required: true },
  qty: { type: Number, required: true, min: 1 },

}, {
  timestamps: true // Handles quotation_created_at
});

const Quotation = mongoose.model('Quotation', quotationSchema);
module.exports = Quotation;
