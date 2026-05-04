const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true },
  phone: { type: String, required: true, maxlength: 15 },
  resume: { type: String, required: true }, // Store path to resume file
  cover_letter: { type: String },
  position_applied: { type: String, required: true, maxlength: 100 },
}, {
  timestamps: true // Handles date_applied
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
module.exports = JobApplication;
