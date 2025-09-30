const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const controller = require("../controllers/taskController");

const router = express.Router();

router.post("/", protect, authorize("task:create"), controller.createTask);
router.get("/work/:workId", protect, authorize("task:read"), controller.getTasks);
router.get("/:id", protect, authorize("task:read"), controller.getTaskById);
router.put("/:id", protect, authorize("task:update"), controller.updateTask);
router.delete("/:id", protect, authorize("task:delete"), controller.deleteTask);

module.exports = router;
