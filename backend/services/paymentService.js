const Stripe = require('stripe');
const ApiError = require('../utils/apiError');
const env = require('../config/env');

const stripe = () => {
  if (!env.stripeSecretKey) throw new ApiError(500, 'Stripe is not configured');
  return new Stripe(env.stripeSecretKey);
};

exports.createPaymentIntent = async ({ amount, currency, orderId, userId }) => {
  if (!amount || amount < 1) throw new ApiError(400, 'Invalid payment amount');
  return stripe().paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: String(orderId), userId: String(userId) }
  });
};

exports.constructWebhookEvent = (body, signature) => {
  return stripe().webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
};
