const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

const signToken = user => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback-secret-key-for-dev', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; // Remove password from output

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already in use', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user'
  });

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Bypass OTP for the specific admin email
  if (user.email === 'admin@roadaxe.in') {
    return createSendToken(user, 200, res);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Roadaxe Login OTP',
      message: `Your OTP for login is ${otp}. It is valid for 10 minutes.`
    });
    res.status(200).json({ status: 'success', message: 'OTP sent to your email', email: user.email });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Error sending email. Please try again.', 500));
  }
});

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (user.role !== 'admin') {
    return next(new AppError('You do not have permission to access the dashboard', 403));
  }

  createSendToken(user, 200, res);
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(new AppError('Please provide email and OTP', 400));
  }

  const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
  if (!user) {
    return next(new AppError('Invalid or expired OTP', 400));
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
