import Coupon from '../models/Coupon.js';

// @desc    Apply coupon and calculate discount
// @route   POST /api/coupons/apply
// @access  Public
export const applyCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a coupon code'
      });
    }

    const orderAmount = Number(cartTotal) || 0;
    if (orderAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart total must be greater than 0 to apply coupon'
      });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon code '${code.toUpperCase()}' is invalid`
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active'
      });
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon code has expired'
      });
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`
      });
    }

    let discountValue = 0;
    if (coupon.discountType === 'percentage') {
      discountValue = Math.round((orderAmount * coupon.discountAmount) / 100);
      if (coupon.maxDiscount && discountValue > coupon.maxDiscount) {
        discountValue = coupon.maxDiscount;
      }
    } else {
      discountValue = Math.min(coupon.discountAmount, orderAmount);
    }

    const finalTotal = Math.max(0, orderAmount - discountValue);

    return res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' applied! You saved ₹${discountValue}`,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        discountValue,
        minOrderAmount: coupon.minOrderAmount
      },
      discountValue,
      originalTotal: orderAmount,
      finalTotal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get coupons (active ones for users, all for admin/seller)
// @route   GET /api/coupons
// @access  Public / Private
export const getCoupons = async (req, res, next) => {
  try {
    let query = { isActive: true };

    // If user is admin, show all coupons including inactive
    if (req.user && req.user.role === 'admin') {
      query = {};
    } else if (req.user && req.user.role === 'seller') {
      // Seller sees active platform coupons + their own coupons
      query = {
        $or: [
          { isActive: true },
          { createdBy: req.user._id }
        ]
      };
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private (Admin or Seller)
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      title,
      description,
      discountType,
      discountAmount,
      minOrderAmount,
      maxDiscount,
      validUntil
    } = req.body;

    if (!code || !discountAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coupon code and discount amount'
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon with code '${cleanCode}' already exists`
      });
    }

    const coupon = new Coupon({
      code: cleanCode,
      title: title || cleanCode,
      description: description || '',
      discountType: discountType || 'fixed',
      discountAmount: Number(discountAmount),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: Number(maxDiscount) || 500,
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      createdBy: req.user._id,
      createdByRole: req.user.role === 'admin' ? 'admin' : 'seller'
    });

    const createdCoupon = await coupon.save();

    return res.status(201).json({
      success: true,
      message: `Coupon '${createdCoupon.code}' created successfully`,
      coupon: createdCoupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle coupon active state
// @route   PATCH /api/coupons/:id/toggle
// @access  Private (Admin or Creator Seller)
export const toggleCouponStatus = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Authorization check
    if (req.user.role !== 'admin' && coupon.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this coupon'
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' is now ${coupon.isActive ? 'Active' : 'Disabled'}`,
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin or Creator Seller)
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    if (req.user.role !== 'admin' && coupon.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this coupon'
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
