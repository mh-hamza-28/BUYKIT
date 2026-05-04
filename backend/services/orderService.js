const Cart = require('../models/Cart');
const Order = require('../models/Order');
const ApiError = require('../utils/apiError');
const { getPopulatedCart, summarizeCart } = require('./cartService');

exports.createOrderFromCart = async (userId, shippingAddress, paymentStatus = 'unpaid') => {
  const cart = await getPopulatedCart(userId);
  const cartSummary = summarizeCart(cart);
  if (cartSummary.items.length === 0) throw new ApiError(400, 'Cart is empty');

  const order = await Order.create({
    user: userId,
    items: cartSummary.items.map((item) => ({
      product: item.productId,
      name: item.name,
      image: item.image,
      league: item.league,
      season: item.season,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal
    })),
    shippingAddress,
    itemsTotal: cartSummary.summary.itemsTotal,
    deliveryFee: cartSummary.summary.deliveryFee,
    orderTotal: cartSummary.summary.orderTotal,
    currency: cartSummary.summary.currency,
    status: paymentStatus === 'requires_payment' ? 'pending_payment' : 'processing',
    paymentStatus
  });

  if (paymentStatus !== 'requires_payment') await Cart.updateOne({ user: userId }, { $set: { items: [] } });
  return order;
};
