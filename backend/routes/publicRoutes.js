const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/categories', publicController.getCategories);
router.get('/products', publicController.getProducts);
router.get('/products/:id', publicController.getProduct);
router.get('/articles', publicController.getArticles);
router.get('/articles/:id', publicController.getArticle);
router.get('/testimonials', publicController.getTestimonials);
router.get('/team', publicController.getTeam);

module.exports = router;
