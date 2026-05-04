const router = require('express').Router();
const payments = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/checkout-intent', protect, payments.createCheckoutIntent);

module.exports = router;
