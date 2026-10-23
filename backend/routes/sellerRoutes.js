import express from 'express';
import {
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerStats
} from '../controllers/sellerController.js';
import { protect, sellerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All seller routes require auth & seller/admin role
router.use(protect, sellerOrAdmin);

router.get('/products', getSellerProducts);
router.post('/products', createSellerProduct);
router.put('/products/:id', updateSellerProduct);
router.delete('/products/:id', deleteSellerProduct);

router.get('/orders', getSellerOrders);
router.patch('/orders/:id/status', updateSellerOrderStatus);

router.get('/stats', getSellerStats);

export default router;
