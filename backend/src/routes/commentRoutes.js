const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const controller = require("../controllers/commentController");

const router = express.Router();

router.post("/", protect, authorize("comment:create"), controller.createComment);
router.get("/task/:taskId", protect, authorize("comment:read"), controller.getCommentsForTask);
router.get("/project/:projectId", protect, authorize("comment:read"), controller.getCommentsForProject);
router.put("/:id", protect, authorize("comment:update"), controller.updateComment);
router.delete("/:id", protect, authorize("comment:delete"), controller.deleteComment);

module.exports = router;