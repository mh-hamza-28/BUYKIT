const Cart = require('../models/Cart');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const { validateAddress } = require('../middlewares/validate');
const { createOrderFromCart } = require('../services/orderService');
const { createPaymentIntent, constructWebhookEvent } = require('../services/paymentService');

exports.createCheckoutIntent = asyncHandler(async (req, res) => {
  const shippingAddress = validateAddress(req.body.shippingAddress);
  const order = await createOrderFromCart(req.user._id, shippingAddress, 'requires_payment');
  const intent = await createPaymentIntent({
    amount: order.orderTotal,
    currency: order.currency,
    orderId: order._id,
    userId: req.user._id
  });

  order.paymentIntentId = intent.id;
  await order.save();
  res.status(201).json({
    success: true,
    data: { orderId: order._id, clientSecret: intent.client_secret, amount: order.orderTotal, currency: order.currency }
  });
});

exports.webhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const event = constructWebhookEvent(req.body, signature);

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const order = await Order.findById(intent.metadata.orderId);
    if (!order) throw new ApiError(404, 'Webhook order not found');
    order.paymentStatus = 'paid';
    order.status = 'paid';
    await order.save();
    await Cart.updateOne({ user: order.user }, { $set: { items: [] } });
  }

  res.json({ received: true });
});
