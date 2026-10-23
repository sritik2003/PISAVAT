import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus
} from '../controllers/enquiryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createEnquiry)
  .get(protect, adminOnly, getEnquiries);

router.route('/:id/status')
  .patch(protect, adminOnly, updateEnquiryStatus);

export default router;
