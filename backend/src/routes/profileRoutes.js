const express = require('express');

const profileController = require('../controllers/profileController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(profileController.getProfile));

module.exports = router;
