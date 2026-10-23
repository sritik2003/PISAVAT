import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'pisawat_super_secure_secret_key_2026_jwt'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found for this token' });
      }

      // Check account status
      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          accountStatus: 'suspended',
          message: 'Your account has been suspended by Admin. Please contact support at support@pisawat.com'
        });
      }

      if (user.status === 'on_hold' && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        return res.status(403).json({
          success: false,
          accountStatus: 'on_hold',
          message: 'Your account is currently on hold by Admin. Actions are temporarily restricted.'
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
};

export const sellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Forbidden: Seller or Admin access required' });
  }
};

export const sellerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'seller') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Forbidden: Seller access required' });
  }
};
