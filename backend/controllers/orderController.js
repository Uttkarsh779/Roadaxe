const Order = require('../models/Order');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Shared helper: Build & persist an order document ───────────────────────────
const buildOrder = async (req, next) => {
  const {
    first_name, last_name, phone_number, email, address, city, state, pincode,
    message, product: productName, quantity
  } = req.body;

  const product = await Product.findOne({ name: productName });
  if (!product) { next(new AppError('Product not found', 404)); return null; }

  const qty = parseInt(quantity, 10);
  const total_booking_amount = qty * (product.booking_price || 5000);
  const total_price = qty * product.actual_price;
  const GST_amount = Math.round(total_price * 0.05);
  const total_price_including_gst = total_price + GST_amount;

  const order = await Order.create({
    first_name, last_name, phone_number, email, address, city, state, pincode, message,
    product: productName, quantity: qty,
    total_price, total_booking_amount, GST_amount, total_price_including_gst,
    user: req.user._id
  });

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  order.invoice_number = `ROADX-${dateStr}-${order._id}`;
  await order.save();
  return order;
};

// ─── POST /api/orders/create  (what Checkout.jsx calls) ─────────────────────────
exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await buildOrder(req, next);
  if (!order) return;
  res.status(200).json({ status: 'success', data: { order } });
});

// ─── POST /api/orders/razorpay-order  (Payment.jsx – step 1) ────────────────────
exports.createRazorpayOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return next(new AppError('Order not found', 404));
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorised', 403));
  }

  const amountInPaise = Math.round(order.total_booking_amount * 100);
  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `receipt_${order._id}`
  });

  order.razorpay_order_id = razorpayOrder.id;
  await order.save();

  res.status(200).json({
    status: 'success',
    data: {
      rzpOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID
    }
  });
});

// ─── POST /api/orders/verify-payment  (Payment.jsx – step 2) ────────────────────
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, dbOrderId } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return next(new AppError('Invalid payment signature', 400));
  }

  const order = await Order.findById(dbOrderId);
  if (!order) return next(new AppError('Order not found', 404));

  order.payment_status = 'successful';
  order.payment_id = razorpay_payment_id;
  order.amount_paid = order.total_booking_amount;
  order.payment_method = 'Razorpay';
  order.booking_status = true;
  await order.save();

  try {
    await sendEmail({
      email: order.email,
      subject: 'Congratulations! Your Roadx order is confirmed!',
      html: `<h1>Order Confirmed</h1><p>Thank you ${order.first_name}, your order <strong>${order.invoice_number}</strong> has been confirmed!</p>`
    });
  } catch (err) {
    console.log('[EMAIL] Error sending confirmation:', err.message);
  }

  res.status(200).json({ status: 'success', data: { order } });
});

// ─── GET /api/orders/:orderId  (Invoice.jsx) ────────────────────────────────────
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new AppError('Order not found', 404));

  const isOwner = order.user?.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);
  if (!isOwner && !isAdmin) return next(new AppError('Not authorised to view this order', 403));

  res.status(200).json({ status: 'success', data: { order } });
});

// ─── GET /api/admin/orders  (AdminOrders.jsx) – mounted via adminRoutes ─────────
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().sort('-createdAt').populate('user', 'name email');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

// ─── POST /api/orders/payment-webhook  (public Razorpay server webhook) ─────────
exports.paymentWebhook = catchAsync(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return next(new AppError('Invalid payment signature', 400));
  }

  const order = await Order.findOne({ razorpay_order_id });
  if (!order) return next(new AppError('Order not found', 404));

  order.payment_status = 'successful';
  order.payment_id = razorpay_payment_id;
  order.amount_paid = order.total_booking_amount;
  order.payment_method = 'Razorpay';
  order.booking_status = true;
  await order.save();

  res.status(200).json({ status: 'success', message: 'Payment Successful' });
});
