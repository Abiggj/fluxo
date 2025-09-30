const express = require("express");
const { inviteUser, acceptInvitation, declineInvitation, getInvitations } = require("../controllers/invitationController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/invite", protect, authorize("invitation:create"), inviteUser);
router.post("/accept", protect, authorize("invitation:update"), acceptInvitation);
router.post("/decline", protect, authorize("invitation:update"), declineInvitation);
router.get("/project/:projectId", protect, authorize("invitation:read"), getInvitations);

module.exports = router;