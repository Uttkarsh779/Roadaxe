const mongoose = require('mongoose');

/**
 * OtpStore Schema
 * Stores one-time passwords for email verification.
 * Uses MongoDB TTL index to auto-delete documents after 5 minutes (300 seconds).
 * This means no manual cleanup is required.
 */
const otpStoreSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // createdAt is used by the TTL index to expire the document
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // TTL: 5 minutes (300 seconds)
  },
  // Track resend attempts for rate limiting
  attempts: {
    type: Number,
    default: 0,
  },
});

const OtpStore = mongoose.model('OtpStore', otpStoreSchema);
module.exports = OtpStore;
