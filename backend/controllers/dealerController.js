const DealershipProduct = require('../models/DealershipProduct');
const Quotation = require('../models/Quotation');
const DealershipOrder = require('../models/DealershipOrder');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_ZhD9sVedb8aubQ',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 't5ud6GDoafcqFV5ZMBM8KY7v',
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await DealershipProduct.find();
  res.status(200).json({ status: 'success', data: { products } });
});

exports.createQuote = catchAsync(async (req, res, next) => {
  req.body.customer_name = req.user._id; // link to logged in dealer
  req.body.email_id = req.user.email || req.body.email_id;
  const quote = await Quotation.create(req.body);
  res.status(201).json({ status: 'success', data: { quote } });
});

exports.getMyQuotes = catchAsync(async (req, res, next) => {
  const quotes = await Quotation.find({ customer_name: req.user._id }).populate('product');
  res.status(200).json({ status: 'success', data: { quotes } });
});

exports.createOrderFromQuote = catchAsync(async (req, res, next) => {
  const quote = await Quotation.findById(req.params.id).populate('product');
  if (!quote) return next(new AppError('Quote not found', 404));

  const product = quote.product;
  const gst_price = product.price * (product.gst_percentage / 100);
  const total_price = (product.price + gst_price) * quote.qty;

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total_price * 100),
    currency: 'INR',
    payment_capture: '1'
  });

  const order = await DealershipOrder.create({
    customer_name: req.user.name,
    email: quote.email_id,
    phone_number: quote.phone_number,
    address: quote.address,
    city: quote.city,
    state: quote.state,
    amount: total_price,
    product: product.name,
    payment_id: razorpayOrder.id,
    user: req.user._id
  });

  res.status(200).json({
    status: 'success',
    data: {
      order,
      razorpay_order_id: razorpayOrder.id,
      amount: Math.round(total_price * 100)
    }
  });
});
