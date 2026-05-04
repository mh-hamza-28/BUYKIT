const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const cache = require('../utils/cache');

function productQuery(req) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
  const filter = { isActive: true };
  const search = String(req.query.search || '').trim();
  const league = String(req.query.league || '').trim();
  const badge = String(req.query.badge || '').trim();
  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);

  if (search) filter.$text = { $search: search };
  if (league && league !== 'All') filter.league = league;
  if (badge) filter.badge = badge;
  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filter.price = {};
    if (!Number.isNaN(minPrice)) filter.price.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) filter.price.$lte = maxPrice;
  }

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    name: { name: 1 }
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };
  return { page, limit, filter, sort };
}

exports.listProducts = asyncHandler(async (req, res) => {
  const key = `products:${JSON.stringify(req.query)}`;
  const cached = cache.get(key);
  if (cached) return res.json({ success: true, cached: true, data: cached });

  const { page, limit, filter, sort } = productQuery(req);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter)
  ]);
  const data = {
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 }
  };
  cache.set(key, data, 60000);
  res.json({ success: true, cached: false, data });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: { product } });
});
