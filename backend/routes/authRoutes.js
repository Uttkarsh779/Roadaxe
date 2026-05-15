const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);
router.post('/verify-otp', authController.verifyOtp);
router.post('/logout', authController.logout);

router.get('/me', authMiddleware.protect, authController.getMe);

module.exports = router;
