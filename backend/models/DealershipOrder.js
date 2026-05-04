const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const dealershipOrderSchema = new mongoose.Schema({
  // Customer Details
  customer_name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true },
  phone_number: { type: String, required: true, maxlength: 15 },

  // Address Details
  address: { type: String, required: true },
  city: { type: String, required: true, maxlength: 100 },
  state: { type: String, required: true, maxlength: 100 },

  // Payment and Order Details
  product: { type: String, maxlength: 1000 },
  amount: { type: Number, required: true },
  payment_id: { type: String, maxlength: 100 },
  payment_status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed'], 
    default: 'Pending' 
  },
  order_id: { 
    type: String, 
    default: uuidv4, 
    unique: true 
  },
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: { createdAt: 'order_created_at', updatedAt: false }
});

const DealershipOrder = mongoose.model('DealershipOrder', dealershipOrderSchema);
module.exports = DealershipOrder;
