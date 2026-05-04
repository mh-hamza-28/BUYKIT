const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.accessTokenSecret(), {
    expiresIn: env.accessTokenExpiry
  });

exports.authResponse = (user, token) => ({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
