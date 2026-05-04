const Cart = require('../models/Cart');
const env = require('../config/env');

async function getPopulatedCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

function summarizeCart(cart) {
  const items = cart.items
    .filter((item) => item.product && item.product.isActive)
    .map((item) => {
      const lineTotal = item.product.price * item.quantity;
      return {
        productId: item.product._id,
        name: item.product.name,
        image: item.product.image,
        league: item.product.league,
        season: item.product.season,
        badge: item.product.badge,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal
      };
    });
  const itemsTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = itemsTotal > 0 && itemsTotal < 1500 ? 80 : 0;
  return {
    items,
    summary: {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      itemsTotal,
      deliveryFee,
      orderTotal: itemsTotal + deliveryFee,
      currency: env.currency
    }
  };
}

module.exports = { getPopulatedCart, summarizeCart };
