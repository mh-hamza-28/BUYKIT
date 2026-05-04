module.exports = (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : error.message;
  if (process.env.NODE_ENV !== 'test') console.error(error);
  res.status(status).json({ success: false, message });
};
