import Enquiry from '../models/Enquiry.js';

// @desc    Submit an enquiry / wholesale lead
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, companyName, productInterest, quantity, message } = req.body;

    if (!name || !email || !phone || !message) {
      
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and message'
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      companyName: companyName || '',
      productInterest: productInterest || 'Pisawat Spices Range',
      quantity: quantity || 'Standard',
      message
    });

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our team will contact you shortly.',
      enquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status
// @route   PATCH /api/enquiries/:id/status
// @access  Private/Admin
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    enquiry.status = status || enquiry.status;
    await enquiry.save();

    return res.status(200).json({
      success: true,
      message: 'Enquiry status updated',
      enquiry
    });
  } catch (error) {
    next(error);
  }
};
