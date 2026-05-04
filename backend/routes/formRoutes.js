const express = require('express');
const formController = require('../controllers/formController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/enquiry', formController.submitEnquiry);
router.post('/dealership-request', formController.submitDealershipRequest);
router.post('/career', upload.single('resume'), formController.submitCareer);

module.exports = router;
