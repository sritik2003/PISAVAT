import express from 'express';
import {
  applyCoupon,
  getCoupons,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, sellerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Apply coupon & list active coupons
router.post('/apply', applyCoupon);
router.get('/', getCoupons);

// Seller/Admin: Create, toggle, delete
router.post('/', protect, sellerOrAdmin, createCoupon);
router.patch('/:id/toggle', protect, sellerOrAdmin, toggleCouponStatus);
router.delete('/:id', protect, sellerOrAdmin, deleteCoupon);

export default router;
