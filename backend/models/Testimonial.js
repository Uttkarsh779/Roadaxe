const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  image: { type: String },
  designation: { type: String, required: true, maxlength: 255 },
  review: { type: String, required: true },
  stars: { type: Number, default: 1, min: 1, max: 5 },
}, {
  timestamps: true
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
