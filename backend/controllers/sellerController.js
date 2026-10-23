import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Helper to generate a slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 6);
};

// @desc    Get products created by current seller
// @route   GET /api/seller/products
// @access  Private (Seller/Admin)
export const getSellerProducts = async (req, res, next) => {
  try {
    let query = { seller: req.user._id };

    // If admin, they can view all products or filter
    if (req.user.role === 'admin' && req.query.all === 'true') {
      query = {};
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product as seller
// @route   POST /api/seller/products
// @access  Private (Seller/Admin)
export const createSellerProduct = async (req, res, next) => {
  try {
    const {
      name,
      subTitle,
      price,
      originalPrice,
      weight,
      category,
      image,
      description,
      whyChoose,
      inStock,
      rating,
      reviewsCount
    } = req.body;

    if (!name || !price || !description || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, price, description, and image URL'
      });
    }

    const slug = generateSlug(name);

    const product = new Product({
      slug,
      name,
      subTitle: subTitle || 'Authentic Premium Quality',
      price: Number(price),
      originalPrice: Number(originalPrice) || Math.round(Number(price) * 1.25),
      weight: weight || '100g Pack',
      category: category || 'Ground Spices',
      image,
      description,
      whyChoose: Array.isArray(whyChoose) ? whyChoose : [
        '100% Pure & Natural',
        'No Added Preservatives',
        'Direct from Source'
      ],
      inStock: inStock !== undefined ? inStock : true,
      rating: Number(rating) || 4.9,
      reviewsCount: Number(reviewsCount) || 12,
      seller: req.user._id,
      sellerName: req.user.storeName || req.user.name || 'Pisawat Seller'
    });

    const createdProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product listed successfully by seller!',
      product: createdProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product by seller
// @route   PUT /api/seller/products/:id
// @access  Private (Seller/Admin)
export const updateSellerProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && product.seller && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own products'
      });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete seller product
// @route   DELETE /api/seller/products/:id
// @access  Private (Seller/Admin)
export const deleteSellerProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role !== 'admin' && product.seller && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own products'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders containing seller's products
// @route   GET /api/seller/orders
// @access  Private (Seller/Admin)
export const getSellerOrders = async (req, res, next) => {
  try {
    // If admin, return all orders; if seller, find products owned by seller
    if (req.user.role === 'admin') {
      const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email phone');
      return res.status(200).json({ success: true, count: orders.length, orders });
    }

    // Find all products of this seller
    const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    // Find orders where orderItems.product is in productIds OR orderItems.seller is req.user._id
    const orders = await Order.find({
      $or: [
        { 'orderItems.product': { $in: productIds } },
        { 'orderItems.seller': req.user._id }
      ]
    }).sort({ createdAt: -1 }).populate('user', 'name email phone');

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status by seller
// @route   PATCH /api/seller/orders/:id/status
// @access  Private (Seller/Admin)
export const updateSellerOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller dashboard statistics
// @route   GET /api/seller/stats
// @access  Private (Seller/Admin)
export const getSellerStats = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    // Seller products
    const productsCount = await Product.countDocuments({ seller: sellerId });

    // Seller orders
    const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    const orders = await Order.find({
      $or: [
        { 'orderItems.product': { $in: productIds } },
        { 'orderItems.seller': sellerId }
      ]
    });

    const totalOrders = orders.length;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;

    orders.forEach(order => {
      // Calculate revenue from this seller's items in order
      const sellerItemsTotal = order.orderItems
        .filter(item => (item.product && productIds.some(id => id.toString() === item.product.toString())) || (item.seller && item.seller.toString() === sellerId.toString()))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

      totalRevenue += (sellerItemsTotal || order.totalAmount);

      if (['Placed', 'Processing', 'Dispatched'].includes(order.orderStatus)) {
        pendingOrders++;
      } else if (order.orderStatus === 'Delivered') {
        deliveredOrders++;
      }
    });

    return res.status(200).json({
      success: true,
      stats: {
        productsCount,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
