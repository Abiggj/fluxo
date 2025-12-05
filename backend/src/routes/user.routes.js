const express = require('express');
const router = express.Router();
const {
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes in this file are protected
router.use(protect);

router.get('/me', getMe);
router.route('/').get(getUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;