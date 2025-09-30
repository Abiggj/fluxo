const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const controller = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, controller.getMe);
router.put("/me", protect, controller.updateMe);
router.put("/update-password", protect, controller.updateMyPassword);

module.exports = router;