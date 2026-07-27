const express = require('express');

const orderController = require('../controllers/orderController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.use(authMiddleware);
router.get('/', requireRole('admin', 'customer'), asyncHandler(orderController.listOrders));
router.post('/', requireRole('admin', 'customer'), asyncHandler(orderController.createOrder));

module.exports = router;
