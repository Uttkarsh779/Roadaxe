const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxlength: 50 },
  last_name: { type: String, required: true, maxlength: 50 },
  phone_number: { type: String, required: true, maxlength: 15 },
  email: { type: String, required: true },
  
  address: { type: String, required: true },
  city: { type: String, required: true, maxlength: 100 },
  state: { type: String, required: true, maxlength: 100 },
  pincode: { type: String, required: true, maxlength: 10 },
  message: { type: String },
  
  product: { type: String, required: true, maxlength: 255 }, // Product Name
  quantity: { type: Number, required: true, min: 1 },
  
  total_price: { type: Number, required: true },
  total_booking_amount: { type: Number, required: true },
  GST_amount: { type: Number, default: 0 },
  total_price_including_gst: { type: Number },
  
  booking_status: { type: Boolean, default: false },
  
  payment_id: { type: String, maxlength: 255 },
  payment_status: { 
    type: String, 
    enum: ['pending', 'successful', 'failed'], 
    default: 'pending' 
  },
  amount_paid: { type: Number, default: 0 },
  payment_method: { type: String, maxlength: 50 },
  
  razorpay_order_id: { type: String, maxlength: 255 },
  invoice_number: { type: String, maxlength: 50 },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to authenticated user if they exist
}, {
  timestamps: true // Handles created_at and updated_at
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
