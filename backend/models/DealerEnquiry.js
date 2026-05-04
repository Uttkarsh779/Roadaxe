const mongoose = require('mongoose');

const dealerEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true },
  phone_number: { type: String, required: true, maxlength: 15 },
  subject: { type: String, required: true, maxlength: 255 },
  message: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed'] },
}, {
  timestamps: true
});

const DealerEnquiry = mongoose.model('DealerEnquiry', dealerEnquirySchema);
module.exports = DealerEnquiry;
