const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        image: String,
        league: String,
        season: String,
        size: String,
        quantity: Number,
        unitPrice: Number,
        lineTotal: Number
      }
    ],
    shippingAddress: {
      fullName: String,
      mobile: String,
      email: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String
    },
    itemsTotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    orderTotal: { type: Number, required: true },
    currency: { type: String, default: 'inr' },
    status: {
      type: String,
      enum: ['pending_payment', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
      index: true
    },
    paymentStatus: { type: String, enum: ['unpaid', 'requires_payment', 'paid', 'failed'], default: 'unpaid' },
    paymentIntentId: String,
    trackingNumber: String,
    shippingPartner: { type: String, default: 'India Post' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
