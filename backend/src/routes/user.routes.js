const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/me', protect, getUser);

module.exports = router;
