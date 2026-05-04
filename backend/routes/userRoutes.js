const router = require('express').Router();
const users = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.patch('/me', users.updateProfile);
router.post('/addresses', users.addAddress);

module.exports = router;
