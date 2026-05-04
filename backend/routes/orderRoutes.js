const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Public: Razorpay server-to-server webhook ──────────────────────────────────
router.post('/payment-webhook', orderController.paymentWebhook);

// ─── Protected: All routes below require login ──────────────────────────────────
router.use(authMiddleware.protect);

// Customer order flow
router.post('/create', orderController.createOrder);            // Checkout.jsx
router.post('/razorpay-order', orderController.createRazorpayOrder); // Payment.jsx step 1
router.post('/verify-payment', orderController.verifyPayment);  // Payment.jsx step 2
router.get('/:orderId', orderController.getOrder);              // Invoice.jsx

module.exports = router;
