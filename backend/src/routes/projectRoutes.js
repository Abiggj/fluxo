const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const controller = require("../controllers/projectController");

const router = express.Router();

router.post("/", protect, authorize("project:create"), controller.createProject);
router.get("/", protect, authorize("project:read"), controller.getProjects);
router.get("/:id", protect, authorize("project:read"), controller.getProjectById);
router.put("/:id", protect, authorize("project:update"), controller.updateProject);
router.delete("/:id", protect, authorize("project:delete"), controller.deleteProject);

module.exports = router;
