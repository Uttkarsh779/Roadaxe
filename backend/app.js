const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const formRoutes = require('./routes/formRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Serve migrated media from Django (legacy images)
console.log('Serving media from:', path.resolve(__dirname, '../media'));
app.use('/uploads', express.static(path.resolve(__dirname, '../media')));

// Serve newly uploaded files (multer stores here)
app.use('/uploads', express.static(path.resolve(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/enquiry', enquiryRoutes);

// Unhandled Route
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
