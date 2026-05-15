const express = require('express');
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const enquiryController = require('../controllers/enquiryController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// ─── All admin routes require login + admin/superadmin role ─────────────────────
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin', 'superadmin'));

// Dashboard stats
router.get('/stats', adminController.getStats);

// ─── Categories ─────────────────────────────────────────────────────────────────
router.route('/categories')
  .post(upload.single('image'), adminController.createCategory);
router.route('/categories/:id')
  .patch(upload.single('image'), adminController.updateCategory)
  .delete(adminController.deleteCategory);

// ─── Products ────────────────────────────────────────────────────────────────────
const productUploads = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'highlight_1_icon', maxCount: 1 },
  { name: 'highlight_2_icon', maxCount: 1 },
  { name: 'highlight_3_icon', maxCount: 1 },
  { name: 'highlight_4_icon', maxCount: 1 },
  { name: 'highlight_5_icon', maxCount: 1 },
  { name: 'highlight_6_icon', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]);

router.route('/products')
  .post(productUploads, adminController.createProduct);
router.route('/products/:id')
  .patch(productUploads, adminController.updateProduct)
  .delete(adminController.deleteProduct);

// ─── Articles ────────────────────────────────────────────────────────────────────
router.route('/articles')
  .post(upload.fields([{ name: 'banner_image', maxCount: 1 }, { name: 'thumbnail_image', maxCount: 1 }]), adminController.createArticle);
router.route('/articles/:id')
  .patch(upload.fields([{ name: 'banner_image', maxCount: 1 }, { name: 'thumbnail_image', maxCount: 1 }]), adminController.updateArticle)
  .delete(adminController.deleteArticle);

// ─── Testimonials ────────────────────────────────────────────────────────────────
router.route('/testimonials')
  .post(upload.single('image'), adminController.createTestimonial);
router.route('/testimonials/:id')
  .patch(upload.single('image'), adminController.updateTestimonial)
  .delete(adminController.deleteTestimonial);

// ─── Employees ───────────────────────────────────────────────────────────────────
router.route('/employees')
  .post(upload.single('image'), adminController.createEmployee);
router.route('/employees/:id')
  .patch(upload.single('image'), adminController.updateEmployee)
  .delete(adminController.deleteEmployee);

// ─── Customer Orders ────────────────────────────────────────────────────────────
router.get('/orders', adminController.getAllOrders);                 // AdminOrders.jsx
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.get('/dealership-orders', adminController.getAllDealershipOrders);

// ─── Customer Enquiries ──────────────────────────────────────────────────────────
router.get('/enquiries', adminController.getAllEnquiries);           // AdminEnquiries.jsx
router.patch('/enquiries/:id/attend', adminController.attendEnquiry);
router.delete('/enquiries/:id', adminController.deleteEnquiry);

// ─── Dealership Enquiries (Applications) ─────────────────────────────────────────
router.get('/dealership-enquiries', adminController.getAllDealershipEnquiries);     // AdminDealerEnquiries.jsx
router.patch('/dealership-enquiries/:id', adminController.updateDealershipEnquiry);
router.delete('/dealership-enquiries/:id', adminController.deleteDealershipEnquiry);

// ─── Career Applications ─────────────────────────────────────────────────────────
router.get('/career-applications', adminController.getAllCareerApplications);       // AdminCareers.jsx
router.delete('/career-applications/:id', adminController.deleteCareerApplication);

// ─── Product Enquiries (from EnquiryModal) ───────────────────────────────────
router.get('/product-enquiries', enquiryController.getAllProductEnquiries);
router.patch('/product-enquiries/:id/status', enquiryController.updateProductEnquiryStatus);
router.delete('/product-enquiries/:id', enquiryController.deleteProductEnquiry);

module.exports = router;
