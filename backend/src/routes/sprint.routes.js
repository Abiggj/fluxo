const express = require('express');
const router = express.Router();
const {
  getSprints,
  getSprint,
  createSprint,
  updateSprint,
  deleteSprint,
} = require('../controllers/sprint.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getSprints).post(protect, createSprint);
router
  .route('/:id')
  .get(protect, getSprint)
  .put(protect, updateSprint)
  .delete(protect, deleteSprint);

module.exports = router;
