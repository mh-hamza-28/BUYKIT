const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const cache = require('../utils/cache');

const slugify = (value) =>
  String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

exports.stats = asyncHandler(async (req, res) => {
  const [users, products, orders, revenue] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$orderTotal' } } }])
  ]);
  res.json({ success: true, data: { users, products, orders, revenue: revenue[0]?.total || 0 } });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    slug: req.body.slug || slugify(req.body.name),
    image: req.body.image,
    price: Number(req.body.price),
    league: req.body.league,
    season: req.body.season,
    badge: req.body.badge || 'NEW',
    stock: Number(req.body.stock ?? 100),
    sizes: req.body.sizes || ['S', 'M', 'L', 'XL', 'XXL']
  });
  cache.clear('products:');
  res.status(201).json({ success: true, data: { product } });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, 'Product not found');
  cache.clear('products:');
  res.json({ success: true, data: { product } });
});

exports.listOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const filter = req.query.status ? { status: req.query.status } : {};
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter)
  ]);
  res.json({ success: true, data: { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } } });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const allowed = ['processing', 'paid', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(req.body.status)) throw new ApiError(400, 'Invalid order status');
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, trackingNumber: req.body.trackingNumber },
    { new: true }
  );
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: { order } });
});
