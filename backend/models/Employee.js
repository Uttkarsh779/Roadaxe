const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  image: { type: String, required: true },
  designation: { type: String, required: true, maxlength: 255 },
  instagram_link: { type: String },
  linkedin_link: { type: String },
  x_link: { type: String },
  facebook_link: { type: String },
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
