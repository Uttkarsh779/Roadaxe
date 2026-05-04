const Enquiry = require('../models/Enquiry');
const JobApplication = require('../models/JobApplication');
const DealershipRequest = require('../models/DealershipRequest');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

exports.submitEnquiry = catchAsync(async (req, res, next) => {
  const enquiry = await Enquiry.create(req.body);
  
  // Async email to customer
  try {
    await sendEmail({
      email: enquiry.email,
      subject: 'Your enquiry is received!',
      html: `<h1>Thank You</h1><p>We have received your enquiry and will get back to you soon.</p>`
    });
  } catch (err) {
    console.log('Error sending enquiry email', err);
  }

  res.status(201).json({ status: 'success', data: { enquiry } });
});

exports.submitCareer = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.resume = req.file.path; // Multer saves the resume
  }
  const application = await JobApplication.create(req.body);
  res.status(201).json({ status: 'success', data: { application } });
});

exports.submitDealershipRequest = catchAsync(async (req, res, next) => {
  const requestDoc = await DealershipRequest.create(req.body);
  res.status(201).json({ status: 'success', data: { requestDoc } });
});
