const Order = require('../models/Order');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { validateAddress, validateObjectId } = require('../middlewares/validate');
const { createOrderFromCart } = require('../services/orderService');

exports.createOrder = asyncHandler(async (req, res) => {
  const shippingAddress = validateAddress(req.body.shippingAddress);
  const order = await createOrderFromCart(req.user._id, shippingAddress);
  res.status(201).json({ success: true, data: { order } });
});

exports.listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { orders } });
});

exports.getOrder = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, 'orderId');
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: { order } });
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, 'orderId');
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new ApiError(404, 'Order not found');
  if (['shipped', 'delivered'].includes(order.status)) throw new ApiError(400, 'This order can no longer be cancelled');
  order.status = 'cancelled';
  await order.save();
  res.json({ success: true, data: { order } });
});
