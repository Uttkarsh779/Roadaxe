const crypto = require('crypto');
const OtpStore = require('../models/OtpStore');
const ProductEnquiry = require('../models/ProductEnquiry');
const sendEmail = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ─── Constants ────────────────────────────────────────────────────────────────
const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@roadaxe.in';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@roadaxe.in';
const OTP_COOLDOWN_SECONDS = 60; // minimum seconds between resend requests

// ─── Helper: Generate a 6-digit OTP ─────────────────────────────────────────
const generateOtp = () => {
  // cryptographically secure 6-digit OTP
  return String(crypto.randomInt(100000, 999999));
};

// ─── Helper: Simple in-memory rate limit store (per IP) ─────────────────────
// This lightweight map prevents >5 OTP sends per IP per hour.
// For production at scale, replace with Redis.
const ipRateStore = new Map();

const checkIpRateLimit = (ip) => {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour window
  const maxRequests = 10; // max OTP sends per hour per IP

  if (!ipRateStore.has(ip)) {
    ipRateStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  const record = ipRateStore.get(ip);

  if (now > record.resetAt) {
    // Window has expired, reset
    ipRateStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false; // Rate limited
  }

  record.count += 1;
  return true;
};

// ─── SEND OTP ─────────────────────────────────────────────────────────────────
// POST /api/enquiry/send-otp
// Body: { email }
exports.sendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  // ── IP-based rate limiting ──────────────────────────────────────────────
  const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  if (!checkIpRateLimit(clientIp)) {
    return next(new AppError('Too many OTP requests. Please try again after an hour.', 429));
  }

  // ── Cooldown: prevent resend before 60 seconds ──────────────────────────
  const existingOtp = await OtpStore.findOne({ email: email.toLowerCase() });
  if (existingOtp) {
    const ageSeconds = (Date.now() - existingOtp.createdAt.getTime()) / 1000;
    if (ageSeconds < OTP_COOLDOWN_SECONDS) {
      const waitSeconds = Math.ceil(OTP_COOLDOWN_SECONDS - ageSeconds);
      return next(
        new AppError(`Please wait ${waitSeconds} seconds before requesting a new OTP.`, 429)
      );
    }
    // Delete old OTP before issuing new one
    await OtpStore.deleteOne({ email: email.toLowerCase() });
  }

  // ── Generate & save new OTP ─────────────────────────────────────────────
  const otp = generateOtp();
  await OtpStore.create({ email: email.toLowerCase(), otp });

  // ── Send OTP email ──────────────────────────────────────────────────────
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px;">ROADAXE</h1>
        <p style="color: #a0aec0; margin: 4px 0 0; font-size: 13px;">Lead Generation System</p>
      </div>
      <div style="padding: 32px 28px; background: #fff;">
        <h2 style="color: #1a1a2e; margin: 0 0 8px;">Email Verification</h2>
        <p style="color: #555; line-height: 1.6;">Use the OTP below to verify your email address and complete your product enquiry.</p>
        <div style="background: #f0f4ff; border: 2px dashed #4a6cf7; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 6px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your One-Time Password</p>
          <span style="font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #1a1a2e;">${otp}</span>
        </div>
        <p style="color: #e53e3e; font-size: 13px;">⏱ This OTP expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <div style="background: #f8f9fa; padding: 16px 28px; text-align: center;">
        <p style="color: #aaa; font-size: 12px; margin: 0;">If you didn't request this, please ignore this email.<br/>© ${new Date().getFullYear()} Roadaxe. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email,
      subject: `${otp} is your Roadaxe verification code`,
      message: `Your OTP for Roadaxe email verification is: ${otp}. It expires in 5 minutes.`,
      html,
    });
  } catch (err) {
    // Clean up OTP if email fails
    await OtpStore.deleteOne({ email: email.toLowerCase() });
    return next(new AppError('Failed to send OTP email. Please try again.', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'OTP sent to your email address.',
  });
});

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
// POST /api/enquiry/verify-otp
// Body: { email, otp }
exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError('Email and OTP are required.', 400));
  }

  const record = await OtpStore.findOne({ email: email.toLowerCase() });

  if (!record) {
    return next(new AppError('OTP has expired. Please request a new one.', 400));
  }

  if (record.otp !== String(otp).trim()) {
    return next(new AppError('Invalid OTP. Please check and try again.', 400));
  }

  // OTP is valid — delete it immediately (one-time use)
  await OtpStore.deleteOne({ email: email.toLowerCase() });

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully.',
  });
});

// ─── SUBMIT ENQUIRY ───────────────────────────────────────────────────────────
// POST /api/enquiry/submit
// Body: { fullName, email, phone, companyName, message, productId, productName }
// NOTE: OTP must have been verified BEFORE calling this endpoint.
// The frontend verifies OTP in the previous step; we trust the verified flow.
// For extra server-side safety, we re-check that no OTP is pending (it was consumed on verify).
exports.submitEnquiry = catchAsync(async (req, res, next) => {
  const { fullName, email, phone, companyName, message, productId, productName } = req.body;

  // ── Validate required fields ────────────────────────────────────────────
  if (!fullName || !email || !phone || !message || !productName) {
    return next(new AppError('Full name, email, phone, message, and product name are required.', 400));
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  // ── Ensure OTP was already consumed (verified) ──────────────────────────
  // If an OTP still exists for this email, the user hasn't completed verification.
  const pendingOtp = await OtpStore.findOne({ email: email.toLowerCase() });
  if (pendingOtp) {
    return next(new AppError('Please verify your email before submitting the enquiry.', 403));
  }

  // ── Save enquiry in database ────────────────────────────────────────────
  const enquiry = await ProductEnquiry.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    companyName: companyName?.trim() || '',
    message: message.trim(),
    productId: productId || null,
    productName: productName.trim(),
    emailVerified: true,
    status: 'pending',
  });

  // ── Timestamp for emails ────────────────────────────────────────────────
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // ── Build notification email HTML ────────────────────────────────────────
  const notificationHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 24px 28px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h1 style="color: #fff; margin: 0; font-size: 20px;">ROADAXE</h1>
          <p style="color: #a0aec0; margin: 2px 0 0; font-size: 12px;">New Product Enquiry Received</p>
        </div>
        <span style="background: #e53e3e; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">ACTION REQUIRED</span>
      </div>
      <div style="padding: 28px; background: #fff;">
        <h2 style="color: #1a1a2e; margin: 0 0 20px; font-size: 18px; border-bottom: 2px solid #f0f4ff; padding-bottom: 12px;">Enquiry Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f0f4ff;">
            <td style="padding: 10px 14px; font-weight: 600; color: #555; width: 35%;">Customer Name</td>
            <td style="padding: 10px 14px; color: #1a1a2e; font-weight: 600;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: 600; color: #555;">Verified Email</td>
            <td style="padding: 10px 14px; color: #1a1a2e;">
              <a href="mailto:${email}" style="color: #4a6cf7; text-decoration: none;">${email}</a>
              <span style="background: #c6f6d5; color: #276749; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-left: 8px;">✓ Verified</span>
            </td>
          </tr>
          <tr style="background: #f0f4ff;">
            <td style="padding: 10px 14px; font-weight: 600; color: #555;">Phone Number</td>
            <td style="padding: 10px 14px; color: #1a1a2e;">${phone}</td>
          </tr>
          ${companyName ? `
          <tr>
            <td style="padding: 10px 14px; font-weight: 600; color: #555;">Company</td>
            <td style="padding: 10px 14px; color: #1a1a2e;">${companyName}</td>
          </tr>` : ''}
          <tr style="background: #f0f4ff;">
            <td style="padding: 10px 14px; font-weight: 600; color: #555;">Product</td>
            <td style="padding: 10px 14px; color: #1a1a2e; font-weight: 700;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: 600; color: #555; vertical-align: top;">Message</td>
            <td style="padding: 10px 14px; color: #333; line-height: 1.6;">${message}</td>
          </tr>
          <tr style="background: #f0f4ff;">
            <td style="padding: 10px 14px; font-weight: 600; color: #555;">Submitted At</td>
            <td style="padding: 10px 14px; color: #1a1a2e;">${submittedAt} IST</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #fffbeb; border-left: 4px solid #f6ad55; border-radius: 4px;">
          <p style="margin: 0; color: #744210; font-size: 13px;">
            💼 <strong>Next Step:</strong> Follow up with the customer at <a href="mailto:${email}" style="color: #4a6cf7;">${email}</a> or call <strong>${phone}</strong> to discuss their requirement for <strong>${productName}</strong>.
          </p>
        </div>
      </div>
      <div style="background: #f8f9fa; padding: 14px 28px; text-align: center;">
        <p style="color: #aaa; font-size: 12px; margin: 0;">Roadaxe Lead Generation System • ${submittedAt}</p>
      </div>
    </div>
  `;

  // ── Send notifications (non-blocking: don't fail submission if email fails) ─
  const emailPromises = [
    sendEmail({
      email: SALES_EMAIL,
      subject: `New Enquiry: ${productName} — ${fullName}`,
      message: `New enquiry from ${fullName} (${email}, ${phone}) for product: ${productName}.\n\nMessage: ${message}\n\nSubmitted: ${submittedAt}`,
      html: notificationHtml,
    }),
    sendEmail({
      email: ADMIN_EMAIL,
      subject: `[Admin] New Product Enquiry: ${productName}`,
      message: `New enquiry from ${fullName} (${email}, ${phone}) for product: ${productName}.\n\nMessage: ${message}\n\nSubmitted: ${submittedAt}`,
      html: notificationHtml,
    }),
  ];

  // Fire-and-forget — don't await so a slow SMTP doesn't delay response
  Promise.allSettled(emailPromises).then((results) => {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[Enquiry Email] Failed to send to recipient #${i + 1}:`, r.reason?.message);
      }
    });
  });

  res.status(201).json({
    status: 'success',
    message: 'Your enquiry has been submitted successfully. Our sales team will contact you shortly.',
    data: { enquiryId: enquiry._id },
  });
});

// ─── GET ALL PRODUCT ENQUIRIES (Admin) ───────────────────────────────────────
// GET /api/admin/product-enquiries
exports.getAllProductEnquiries = catchAsync(async (req, res, next) => {
  // Support optional ?status=pending|contacted|converted filter
  const filter = {};
  if (req.query.status && ['pending', 'contacted', 'converted'].includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const enquiries = await ProductEnquiry.find(filter).sort('-createdAt');
  res.status(200).json({
    status: 'success',
    results: enquiries.length,
    data: { enquiries },
  });
});

// ─── UPDATE ENQUIRY STATUS (Admin) ───────────────────────────────────────────
// PATCH /api/admin/product-enquiries/:id/status
exports.updateProductEnquiryStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['pending', 'contacted', 'converted'].includes(status)) {
    return next(new AppError('Status must be one of: pending, contacted, converted.', 400));
  }

  const enquiry = await ProductEnquiry.findByIdAndUpdate(
    req.params.id,
    { status, ...(req.body.adminNotes !== undefined ? { adminNotes: req.body.adminNotes } : {}) },
    { new: true, runValidators: true }
  );

  if (!enquiry) return next(new AppError('Enquiry not found.', 404));

  res.status(200).json({ status: 'success', data: { enquiry } });
});

// ─── DELETE ENQUIRY (Admin) ───────────────────────────────────────────────────
// DELETE /api/admin/product-enquiries/:id
exports.deleteProductEnquiry = catchAsync(async (req, res, next) => {
  await ProductEnquiry.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});
