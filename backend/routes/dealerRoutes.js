const express = require('express');
const dealerController = require('../controllers/dealerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);
// Assuming dealers have role 'dealer'
router.use(authMiddleware.restrictTo('dealer', 'admin', 'superadmin'));

router.get('/products', dealerController.getProducts);
router.route('/quotes')
  .get(dealerController.getMyQuotes)
  .post(dealerController.createQuote);

router.post('/orders/create/:id', dealerController.createOrderFromQuote);

module.exports = router;
