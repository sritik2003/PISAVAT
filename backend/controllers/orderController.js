import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (or Private with optional user)
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalAmount,
      notes
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items found'
      });
    }

    if (!customerName || !customerPhone || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name, phone, and complete shipping address'
      });
    }

    const order = new Order({
      user: req.user ? req.user._id : null,
      customerName,
      customerEmail,
      customerPhone,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice: itemsPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalAmount: totalAmount || itemsPrice,
      notes: notes || ''
    });

    const createdOrder = await order.save();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private / Public with match
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};
