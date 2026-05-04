const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    league: { type: String, required: true, trim: true, index: true },
    season: { type: String, required: true },
    badge: { type: String, enum: ['BESTSELLER', 'NEW', 'HOT', 'SALE'], default: 'NEW' },
    stock: { type: Number, default: 100, min: 0 },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL', 'XXL'] },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
