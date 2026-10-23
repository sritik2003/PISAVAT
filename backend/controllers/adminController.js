import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role) {
      if (role === 'buyer') {
        query.role = { $in: ['buyer', 'user'] };
      } else {
        query.role = role;
      }
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user account status (suspend, hold, activate)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;

    if (!['active', 'suspended', 'on_hold'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, suspended, or on_hold'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent suspending the main admin self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot suspend or hold your own admin account'
      });
    }

    user.status = status;
    user.statusReason = reason || '';
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User '${user.name}' status updated to '${status.toUpperCase()}'`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        statusReason: user.statusReason
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (buyer, seller, admin)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['buyer', 'seller', 'admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Map 'user' to 'buyer'
    user.role = role === 'user' ? 'buyer' : role;
    if (user.role === 'seller' && !user.storeName) {
      user.storeName = `${user.name}'s Store`;
    }
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User '${user.name}' role updated to '${user.role}'`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `User '${user.name}' deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const buyersCount = await User.countDocuments({ role: { $in: ['buyer', 'user'] } });
    const sellersCount = await User.countDocuments({ role: 'seller' });
    const suspendedCount = await User.countDocuments({ status: 'suspended' });
    const onHoldCount = await User.countDocuments({ status: 'on_hold' });

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        buyersCount,
        sellersCount,
        suspendedCount,
        onHoldCount,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};
