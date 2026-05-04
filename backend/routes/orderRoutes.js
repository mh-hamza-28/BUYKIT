const router = require('express').Router();
const orders = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.post('/', orders.createOrder);
router.get('/', orders.listMyOrders);
router.get('/:id', orders.getOrder);
router.patch('/:id/cancel', orders.cancelOrder);

module.exports = router;
