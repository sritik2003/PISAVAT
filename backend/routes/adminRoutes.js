import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAdminStats
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/stats', getAdminStats);

export default router;
