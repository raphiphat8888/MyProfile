const express = require('express');

const productController = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(productController.listProducts));
router.get('/:id', asyncHandler(productController.getProduct));
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  asyncHandler(productController.createProduct),
);
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  asyncHandler(productController.updateProduct),
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  asyncHandler(productController.deleteProduct),
);

module.exports = router;
