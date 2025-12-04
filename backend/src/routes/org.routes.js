const express = require('express');
const router = express.Router();
const { getOrg } = require('../controllers/org.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:slug', protect, getOrg);

module.exports = router;
