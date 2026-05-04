function required(name, fallbackName) {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) throw new Error(`${name}${fallbackName ? ` or ${fallbackName}` : ''} is missing`);
  return value;
}

module.exports = {
  get port() {
    return process.env.PORT || 5000;
  },
  get nodeEnv() {
    return process.env.NODE_ENV || 'development';
  },
  get mongoUri() {
    return process.env.MONGO_URI || process.env.MONGODB_URI;
  },
  accessTokenSecret: () => required('ACCESS_TOKEN_SECRET', 'JWT_SECRET'),
  get accessTokenExpiry() {
    return process.env.ACCESS_TOKEN_EXPIRY || process.env.JWT_EXPIRES_IN || '7d';
  },
  get frontendOrigin() {
    return process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || true;
  },
  get currency() {
    return process.env.CURRENCY || 'inr';
  },
  get stripeSecretKey() {
    return process.env.STRIPE_SECRET_KEY;
  },
  get stripeWebhookSecret() {
    return process.env.STRIPE_WEBHOOK_SECRET;
  },
  get smtp() {
    return {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.CONTACT_TO_EMAIL || 'hamzamohammad0028@gmail.com'
    };
  }
};
