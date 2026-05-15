const express = require('express');
const enquiryController = require('../controllers/enquiryController');

const router = express.Router();

/**
 * Public Enquiry Routes — no auth required.
 * These are the APIs consumed by the frontend enquiry modal.
 *
 * Rate limiting is handled inside the controller (IP-based).
 * OTP expires via MongoDB TTL index after 5 minutes.
 */

// Step 1: Send 6-digit OTP to email
// POST /api/enquiry/send-otp  — Body: { email }
router.post('/send-otp', enquiryController.sendOtp);

// Step 2: Verify OTP (consumes it — one time use)
// POST /api/enquiry/verify-otp  — Body: { email, otp }
router.post('/verify-otp', enquiryController.verifyOtp);

// Step 3: Submit the full enquiry (only allowed after OTP consumed)
// POST /api/enquiry/submit  — Body: { fullName, email, phone, companyName, message, productId, productName }
router.post('/submit', enquiryController.submitEnquiry);

module.exports = router;
