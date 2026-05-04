const router = require('express').Router();
const cart = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', cart.getCart);
router.post('/items', cart.addItem);
router.patch('/items/:productId', cart.updateItem);
router.delete('/items/:productId', cart.removeItem);
router.delete('/', cart.clearCart);

module.exports = router;
