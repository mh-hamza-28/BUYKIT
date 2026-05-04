const router = require('express').Router();
const admin = require('../controllers/adminController');
const { protect, requireRole } = require('../middlewares/authMiddleware');

router.use(protect, requireRole('admin'));
router.get('/stats', admin.stats);
router.post('/products', admin.createProduct);
router.patch('/products/:id', admin.updateProduct);
router.get('/orders', admin.listOrders);
router.patch('/orders/:id/status', admin.updateOrderStatus);

module.exports = router;
