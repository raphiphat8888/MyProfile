const express = require('express');

const categoryController = require('../controllers/categoryController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(categoryController.listCategories));
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  asyncHandler(categoryController.createCategory),
);

module.exports = router;
