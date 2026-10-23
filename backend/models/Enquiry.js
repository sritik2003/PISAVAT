import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide your contact phone number'],
      trim: true
    },
    companyName: {
      type: String,
      default: '',
      trim: true
    },
    productInterest: {
      type: String,
      default: 'General Wholesale & Spices Enquiry'
    },
    quantity: {
      type: String,
      default: 'Retail / Samples'
    },
    message: {
      type: String,
      required: [true, 'Please provide an enquiry message'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
