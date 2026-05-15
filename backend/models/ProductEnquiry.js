const mongoose = require('mongoose');

/**
 * ProductEnquiry Schema
 * Stores verified product enquiries submitted by customers.
 * Only enquiries with verified emails are saved (OTP-checked before insert).
 * Status enum is CRM-friendly for future integration.
 */
const productEnquirySchema = new mongoose.Schema(
  {
    // ─── Customer Details ────────────────────────────────────────────
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      maxlength: [15, 'Phone cannot exceed 15 characters'],
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message / Requirement is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },

    // ─── Product Details ─────────────────────────────────────────────
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    // ─── Verification Flag ───────────────────────────────────────────
    emailVerified: {
      type: Boolean,
      default: true, // only saved after OTP verification
    },

    // ─── CRM-Friendly Status ─────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'contacted', 'converted'],
      default: 'pending',
    },

    // ─── Admin Notes (for future CRM) ────────────────────────────────
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Index for efficient admin queries
productEnquirySchema.index({ status: 1, createdAt: -1 });
productEnquirySchema.index({ email: 1 });

const ProductEnquiry = mongoose.model('ProductEnquiry', productEnquirySchema);
module.exports = ProductEnquiry;
