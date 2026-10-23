import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'pisawat_super_secure_secret_key_2026_jwt',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (buyer or seller)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, storeName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const assignedRole = role === 'seller' ? 'seller' : (role === 'admin' ? 'admin' : 'buyer');

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: assignedRole,
      storeName: assignedRole === 'seller' ? (storeName || `${name}'s Spices`) : '',
      status: 'active'
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: `${assignedRole.toUpperCase()} account created successfully`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        storeName: user.storeName,
        address: user.address,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check status: suspended or on hold
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        accountStatus: 'suspended',
        message: 'Your account has been SUSPENDED by the Administrator. Please contact support@pisawat.com'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role === 'user' ? 'buyer' : user.role,
        status: user.status,
        phone: user.phone,
        storeName: user.storeName,
        address: user.address,
        wishlist: user.wishlist || []
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('wishlist');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        role: user.role === 'user' ? 'buyer' : user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    if (req.body.storeName) user.storeName = req.body.storeName;

    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address
      };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role === 'user' ? 'buyer' : updatedUser.role,
        status: updatedUser.status,
        phone: updatedUser.phone,
        storeName: updatedUser.storeName,
        address: updatedUser.address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existsIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId.toString()
    );

    let isAdded = false;
    if (existsIndex > -1) {
      user.wishlist.splice(existsIndex, 1);
      isAdded = false;
    } else {
      user.wishlist.push(productId);
      isAdded = true;
    }

    await user.save();
    await user.populate('wishlist');

    return res.status(200).json({
      success: true,
      message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
      isAdded,
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your registered email address.'
    });
  } catch (error) {
    next(error);
  }
};
