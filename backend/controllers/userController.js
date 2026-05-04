const asyncHandler = require('../utils/asyncHandler');
const { validateAddress } = require('../middlewares/validate');

exports.updateProfile = asyncHandler(async (req, res) => {
  if (req.body.name) req.user.name = String(req.body.name).trim();
  await req.user.save();
  res.json({ success: true, data: { user: req.user } });
});

exports.addAddress = asyncHandler(async (req, res) => {
  req.user.addresses.push(validateAddress(req.body));
  await req.user.save();
  res.status(201).json({ success: true, data: { addresses: req.user.addresses } });
});
