const express = require('express');
const router = express.Router();
const {
  createOrg,
  getOrg,
  updateOrg,
  deleteOrg,
  getOrgUsers,
} = require('../controllers/org.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes in this file are protected
router.use(protect);

router.route('/')
  .post(createOrg);

router.route('/:slug')
  .get(getOrg)
  .put(updateOrg)
  .delete(deleteOrg);

router.route('/:slug/users')
  .get(getOrgUsers);

module.exports = router;