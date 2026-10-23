import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  forgotPassword,
  toggleWishlist,
  getWishlist
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);

// Wishlist endpoints
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);

export default router;
