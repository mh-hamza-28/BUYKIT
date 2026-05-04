const Product = require('../models/Product');
const Cart = require('../models/Cart');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { validateObjectId } = require('../middlewares/validate');
const { getPopulatedCart, summarizeCart } = require('../services/cartService');

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getPopulatedCart(req.user._id);
  res.json({ success: true, data: summarizeCart(cart) });
});

exports.addItem = asyncHandler(async (req, res) => {
  validateObjectId(req.body.productId, 'productId');
  const quantity = Math.min(Math.max(Number(req.body.quantity) || 1, 1), 10);
  const size = String(req.body.size || 'M').toUpperCase();
  if (!['S', 'M', 'L', 'XL', 'XXL'].includes(size)) throw new ApiError(400, 'Invalid size');

  const product = await Product.findById(req.body.productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (!product.sizes.includes(size)) throw new ApiError(400, 'Size is not available');
  if (product.stock < quantity) throw new ApiError(400, 'Not enough stock');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const item = cart.items.find((cartItem) => String(cartItem.product) === String(product._id) && cartItem.size === size);
  if (item) item.quantity = Math.min(item.quantity + quantity, 10);
  else cart.items.push({ product: product._id, quantity, size });
  await cart.save();

  cart = await getPopulatedCart(req.user._id);
  res.status(201).json({ success: true, data: summarizeCart(cart) });
});

exports.updateItem = asyncHandler(async (req, res) => {
  validateObjectId(req.params.productId, 'productId');
  const quantity = Number(req.body.quantity);
  const size = String(req.body.size || 'M').toUpperCase();
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new ApiError(400, 'Quantity must be 1-10');

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  const item = cart.items.find((cartItem) => String(cartItem.product) === req.params.productId && cartItem.size === size);
  if (!item) throw new ApiError(404, 'Cart item not found');
  item.quantity = quantity;
  await cart.save();

  const populated = await getPopulatedCart(req.user._id);
  res.json({ success: true, data: summarizeCart(populated) });
});

exports.removeItem = asyncHandler(async (req, res) => {
  validateObjectId(req.params.productId, 'productId');
  const size = String(req.query.size || 'M').toUpperCase();
  await Cart.updateOne(
    { user: req.user._id },
    { $pull: { items: { product: req.params.productId, size } } }
  );
  const cart = await getPopulatedCart(req.user._id);
  res.json({ success: true, data: summarizeCart(cart) });
});

exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } }, { upsert: true });
  const cart = await getPopulatedCart(req.user._id);
  res.json({ success: true, data: summarizeCart(cart) });
});
