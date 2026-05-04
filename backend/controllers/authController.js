const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { validateEmailPassword } = require('../middlewares/validate');
const { signToken, authResponse } = require('../services/tokenService');

exports.register = asyncHandler(async (req, res) => {
  const input = validateEmailPassword(req.body, true);
  const existing = await User.findOne({ email: input.email });
  if (existing) throw new ApiError(409, 'Email is already registered');

  const user = await User.create(input);
  const token = signToken(user);
  res.status(201).json({ success: true, data: authResponse(user, token) });
});

exports.login = asyncHandler(async (req, res) => {
  const input = validateEmailPassword(req.body);
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user || !(await user.comparePassword(input.password))) throw new ApiError(401, 'Invalid email or password');

  const token = signToken(user);
  res.json({ success: true, data: authResponse(user, token) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

exports.logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out on client. Remove token from storage.' });
});
