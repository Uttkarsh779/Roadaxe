const Category = require('../models/Category');
const Product = require('../models/Product');
const Article = require('../models/Article');
const Testimonial = require('../models/Testimonial');
const Employee = require('../models/Employee');
const catchAsync = require('../utils/catchAsync');

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({ status: 'success', data: { categories } });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.query.category) filter.category = req.query.category;
  
  const products = await Product.find(filter).sort('-createdAt');
  res.status(200).json({ status: 'success', data: { products } });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ status: 'fail', message: 'Product not found' });
  }

  // Fetch similar products in the same category (limit to 4)
  const similarProducts = await Product.find({ 
    category: product.category, 
    _id: { $ne: product._id } 
  }).limit(4);

  res.status(200).json({ status: 'success', data: { product, similarProducts } });
});

exports.getArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find().sort('-createdAt');
  res.status(200).json({ status: 'success', data: { articles } });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  res.status(200).json({ status: 'success', data: { article } });
});

exports.getTestimonials = catchAsync(async (req, res, next) => {
  const testimonials = await Testimonial.find();
  res.status(200).json({ status: 'success', data: { testimonials } });
});

exports.getTeam = catchAsync(async (req, res, next) => {
  const team = await Employee.find();
  res.status(200).json({ status: 'success', data: { team } });
});
