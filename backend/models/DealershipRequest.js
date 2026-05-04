const mongoose = require('mongoose');

const dealershipRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true },
  phone_number: { type: String, required: true, maxlength: 15 },
  pincode: { type: String, required: true, maxlength: 10 },
  address: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'connected', 'Completed', 'Approved', 'Rejected'] },
}, {
  timestamps: true
});

const DealershipRequest = mongoose.model('DealershipRequest', dealershipRequestSchema);
module.exports = DealershipRequest;
