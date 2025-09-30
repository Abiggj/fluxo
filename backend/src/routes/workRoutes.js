const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const controller = require("../controllers/workController");

const router = express.Router();

router.post("/", protect, authorize("work:create"), controller.createWork);
router.get("/project/:projectId", protect, authorize("work:read"), controller.getWorks);
router.get("/:id", protect, authorize("work:read"), controller.getWorkById);
router.put("/:id", protect, authorize("work:update"), controller.updateWork);
router.delete("/:id", protect, authorize("work:delete"), controller.deleteWork);

module.exports = router;
