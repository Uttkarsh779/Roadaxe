const Category = require('../models/Category');
const Product = require('../models/Product');
const Article = require('../models/Article');
const Testimonial = require('../models/Testimonial');
const Employee = require('../models/Employee');
const Order = require('../models/Order');
const DealershipOrder = require('../models/DealershipOrder');
const Enquiry = require('../models/Enquiry');
const DealershipRequest = require('../models/DealershipRequest');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteFromCloudinary } = require('../utils/cloudinaryCleanup');

// ─── DASHBOARD STATS ────────────────────────────────────────────────────────────
exports.getStats = catchAsync(async (req, res, next) => {
  const [products, orders, enquiries, dealers] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Enquiry.countDocuments(),
    User.countDocuments({ role: 'dealer' })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      products,
      orders,
      enquiries,
      dealers
    }
  });
});

// ─── CATEGORIES ─────────────────────────────────────────────────────────────────
exports.createCategory = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path || req.file.secure_url || req.file.url;
  const category = await Category.create(req.body);
  res.status(201).json({ status: 'success', data: { category } });
});
exports.updateCategory = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path || req.file.secure_url || req.file.url;
  
  const oldCategory = await Category.findById(req.params.id);
  if (req.file && oldCategory?.image) {
    await deleteFromCloudinary(oldCategory.image);
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ status: 'success', data: { category } });
});
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (category?.image) await deleteFromCloudinary(category.image);
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

// ─── PRODUCTS ────────────────────────────────────────────────────────────────────
const handleProductImages = (req) => {
  if (req.files) {
    const fields = ['image', 'highlight_1_icon', 'highlight_2_icon', 'highlight_3_icon', 'highlight_4_icon', 'highlight_5_icon', 'highlight_6_icon'];
    fields.forEach(field => {
      if (req.files[field]) {
        const file = req.files[field][0];
        req.body[field] = file.path || file.secure_url || file.url;
      }
    });
  }
};

exports.createProduct = catchAsync(async (req, res, next) => {
  handleProductImages(req);
  const product = await Product.create(req.body);
  res.status(201).json({ status: 'success', data: { product } });
});
exports.updateProduct = catchAsync(async (req, res, next) => {
  handleProductImages(req);
  
  const oldProduct = await Product.findById(req.params.id);
  if (oldProduct) {
    const fields = ['image', 'highlight_1_icon', 'highlight_2_icon', 'highlight_3_icon', 'highlight_4_icon', 'highlight_5_icon', 'highlight_6_icon'];
    for (const field of fields) {
      if (req.body[field] && oldProduct[field]) {
        await deleteFromCloudinary(oldProduct[field]);
      }
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return next(new AppError('Product not found', 404));
  res.status(200).json({ status: 'success', data: { product } });
});
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const fields = ['image', 'highlight_1_icon', 'highlight_2_icon', 'highlight_3_icon', 'highlight_4_icon', 'highlight_5_icon', 'highlight_6_icon'];
    for (const field of fields) {
      if (product[field]) await deleteFromCloudinary(product[field]);
    }
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

// ─── ARTICLES ────────────────────────────────────────────────────────────────────
exports.createArticle = catchAsync(async (req, res, next) => {
  if (req.files) {
    if (req.files.banner_image) req.body.banner_image = req.files.banner_image[0].path || req.files.banner_image[0].secure_url || req.files.banner_image[0].url;
    if (req.files.thumbnail_image) req.body.thumbnail_image = req.files.thumbnail_image[0].path || req.files.thumbnail_image[0].secure_url || req.files.thumbnail_image[0].url;
  }
  const article = await Article.create(req.body);
  res.status(201).json({ status: 'success', data: { article } });
});
exports.updateArticle = catchAsync(async (req, res, next) => {
  if (req.files) {
    if (req.files.banner_image) req.body.banner_image = req.files.banner_image[0].path || req.files.banner_image[0].secure_url || req.files.banner_image[0].url;
    if (req.files.thumbnail_image) req.body.thumbnail_image = req.files.thumbnail_image[0].path || req.files.thumbnail_image[0].secure_url || req.files.thumbnail_image[0].url;
  }
  
  const oldArticle = await Article.findById(req.params.id);
  if (oldArticle) {
    if (req.body.banner_image && oldArticle.banner_image) await deleteFromCloudinary(oldArticle.banner_image);
    if (req.body.thumbnail_image && oldArticle.thumbnail_image) await deleteFromCloudinary(oldArticle.thumbnail_image);
  }

  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!article) return next(new AppError('Article not found', 404));
  res.status(200).json({ status: 'success', data: { article } });
});
exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (article) {
    if (article.banner_image) await deleteFromCloudinary(article.banner_image);
    if (article.thumbnail_image) await deleteFromCloudinary(article.thumbnail_image);
  }
  await Article.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────────
exports.createTestimonial = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path || req.file.secure_url || req.file.url;
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ status: 'success', data: { testimonial } });
});

exports.updateTestimonial = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path || req.file.secure_url || req.file.url;
  
  const oldTestimonial = await Testimonial.findById(req.params.id);
  if (!oldTestimonial) return next(new AppError('Testimonial not found', 404));

  if (req.file && oldTestimonial.image) {
    await deleteFromCloudinary(oldTestimonial.image);
  }

  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ status: 'success', data: { testimonial } });
});
exports.deleteTestimonial = catchAsync(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (testimonial?.image) await deleteFromCloudinary(testimonial.image);
  await Testimonial.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

// ─── EMPLOYEES ───────────────────────────────────────────────────────────────────
exports.createEmployee = catchAsync(async (req, res, next) => {
  console.log('--- CREATE EMPLOYEE DEBUG ---');
  console.log('FILE RECEIVED:', req.file);
  console.log('BODY RECEIVED:', req.body);
  
  if (req.file) {
    // In multer-storage-cloudinary v4, req.file.path contains the secure_url
    req.body.image = req.file.path || req.file.secure_url || req.file.url;
  } else {
    return next(new AppError('Please upload an image for the employee', 400));
  }

  const employee = await Employee.create(req.body);
  res.status(201).json({ status: 'success', data: { employee } });
});

exports.updateEmployee = catchAsync(async (req, res, next) => {
  console.log('--- UPDATE EMPLOYEE DEBUG ---');
  console.log('FILE RECEIVED:', req.file);
  console.log('BODY RECEIVED:', req.body);

  if (req.file) {
    req.body.image = req.file.path || req.file.secure_url || req.file.url;
  }
  
  const oldEmployee = await Employee.findById(req.params.id);
  if (!oldEmployee) return next(new AppError('Employee not found', 404));

  // If a new image was uploaded, delete the old one from Cloudinary
  if (req.file && oldEmployee.image) {
    await deleteFromCloudinary(oldEmployee.image);
  }

  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { 
    new: true, 
    runValidators: true 
  });

  res.status(200).json({ status: 'success', data: { employee } });
});
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (employee?.image) await deleteFromCloudinary(employee.image);
  await Employee.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

// ─── CUSTOMER ORDERS ────────────────────────────────────────────────────────────
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().sort('-createdAt').populate('user', 'name email');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { delivery_status: req.body.status || req.body.delivery_status }, { new: true });
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});

exports.getAllDealershipOrders = catchAsync(async (req, res, next) => {
  const orders = await DealershipOrder.find().sort('-order_created_at');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

// ─── ENQUIRIES ───────────────────────────────────────────────────────────────────
exports.getAllEnquiries = catchAsync(async (req, res, next) => {
  const enquiries = await Enquiry.find().sort('-createdAt');
  res.status(200).json({ status: 'success', data: { enquiries } });
});
exports.attendEnquiry = catchAsync(async (req, res, next) => {
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: 'Completed' }, { new: true });
  if (!enquiry) return next(new AppError('Enquiry not found', 404));
  res.status(200).json({ status: 'success', data: { enquiry } });
});
exports.deleteEnquiry = catchAsync(async (req, res, next) => {
  await Enquiry.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

// ─── DEALERSHIP ENQUIRIES (Applications) ─────────────────────────────────────────
exports.getAllDealershipEnquiries = catchAsync(async (req, res, next) => {
  const enquiries = await DealershipRequest.find().sort('-createdAt');
  res.status(200).json({ status: 'success', data: { enquiries } });
});
exports.updateDealershipEnquiry = catchAsync(async (req, res, next) => {
  const enquiry = await DealershipRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!enquiry) return next(new AppError('Dealership request not found', 404));
  res.status(200).json({ status: 'success', data: { enquiry } });
});
exports.deleteDealershipEnquiry = catchAsync(async (req, res, next) => {
  await DealershipRequest.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

// ─── CAREER APPLICATIONS ─────────────────────────────────────────────────────────
exports.getAllCareerApplications = catchAsync(async (req, res, next) => {
  const applications = await JobApplication.find().sort('-createdAt');
  res.status(200).json({ status: 'success', data: { applications } });
});
exports.deleteCareerApplication = catchAsync(async (req, res, next) => {
  await JobApplication.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});
