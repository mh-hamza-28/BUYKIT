const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Login required');

  const decoded = jwt.verify(token, env.accessTokenSecret());
  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid token user');

  req.user = user;
  next();
});

exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission for this action'));
  }
  next();
};
