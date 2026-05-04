const validator = require('validator');
const ApiError = require('../utils/apiError');

exports.cleanString = (value) => String(value || '').trim();

exports.validateEmailPassword = (body, requireName = false) => {
  const name = exports.cleanString(body.name);
  const email = exports.cleanString(body.email).toLowerCase();
  const password = String(body.password || '');
  if (requireName && name.length < 2) throw new ApiError(400, 'Name must be at least 2 characters');
  if (!validator.isEmail(email)) throw new ApiError(400, 'Valid email is required');
  if (password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');
  return { name, email, password };
};

exports.validateObjectId = (id, label = 'id') => {
  if (!validator.isMongoId(String(id))) throw new ApiError(400, `Invalid ${label}`);
};

exports.validateAddress = (address = {}) => {
  const required = ['fullName', 'mobile', 'email', 'street', 'city', 'state', 'pincode'];
  const cleaned = {};
  required.forEach((key) => {
    cleaned[key] = exports.cleanString(address[key]);
    if (!cleaned[key]) throw new ApiError(400, `${key} is required`);
  });
  cleaned.landmark = exports.cleanString(address.landmark);
  if (!/^[0-9]{10}$/.test(cleaned.mobile)) throw new ApiError(400, 'Mobile must be 10 digits');
  if (!validator.isEmail(cleaned.email)) throw new ApiError(400, 'Valid email is required');
  if (!/^[0-9]{6}$/.test(cleaned.pincode)) throw new ApiError(400, 'Pincode must be 6 digits');
  return cleaned;
};
