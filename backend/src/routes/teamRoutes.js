const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const controller = require("../controllers/teamController");

const router = express.Router();

router.post("/", protect, authorize("team:create"), controller.createTeam);
router.get("/project/:projectId", protect, authorize("team:read"), controller.getTeams);
router.get("/:id", protect, authorize("team:read"), controller.getTeamById);
router.put("/:id", protect, authorize("team:update"), controller.updateTeam);
router.delete("/:id", protect, authorize("team:delete"), controller.deleteTeam);
router.post("/:id/users/:userId", protect, authorize("team:update"), controller.addUserToTeam);
router.delete("/:id/users/:userId", protect, authorize("team:update"), controller.removeUserFromTeam);

module.exports = router;

