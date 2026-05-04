const router = require('express').Router();
const products = require('../controllers/productController');

router.get('/', products.listProducts);
router.get('/:slug', products.getProduct);

module.exports = router;
