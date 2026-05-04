const validator = require('validator');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { cleanString } = require('../middlewares/validate');
const { sendContactMessage } = require('../services/emailService');

exports.sendMessage = asyncHandler(async (req, res) => {
  const name = cleanString(req.body.name);
  const email = cleanString(req.body.email).toLowerCase();
  const subject = cleanString(req.body.subject);
  const message = cleanString(req.body.message);

  if (name.length < 2) throw new ApiError(400, 'Name must be at least 2 characters');
  if (!validator.isEmail(email)) throw new ApiError(400, 'Valid email is required');
  if (message.length < 10) throw new ApiError(400, 'Message must be at least 10 characters');
  if (subject.length > 120) throw new ApiError(400, 'Subject must be 120 characters or less');

  await sendContactMessage({ name, email, subject, message });
  res.status(202).json({ success: true, message: 'Message sent successfully' });
});
