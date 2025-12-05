const express = require('express');
const router = express.Router();
const {
  getChangeRequest,
  updateChangeRequest,
  updateChangeRequestStatus,
  updateApprovalStatus,
} = require('../controllers/changeRequest.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkProjectMembership } = require('../middleware/project.middleware');
const { hasProjectRole } = require('../middleware/rbac.middleware');
const { ProjectRole } = require('@prisma/client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// All routes in this file are protected and operate on a specific Change Request
router.use(protect);
router.use('/:id', checkProjectMembership); // Ensures user is a member of the project for any CR they access

// Custom middleware to check if user is the proposer or a manager
const isProposerOrManager = async (req, res, next) => {
    const cr = await prisma.changeRequest.findUnique({ where: { id: req.params.id }});
    const isProposer = cr.proposerId === req.user.id;
    const isManager = req.projectMembership.role === ProjectRole.MANAGER;

    if (isProposer || isManager) {
        return next();
    }
    return res.status(403).json({ message: 'You must be the proposer or a project manager to edit.' });
};

router.route('/:id')
  .get(getChangeRequest) // checkProjectMembership is enough
  .put(isProposerOrManager, updateChangeRequest);

router.route('/:id/status')
  .put(hasProjectRole([ProjectRole.MANAGER]), updateChangeRequestStatus);

router.route('/:id/approvals/:approvalId')
  .put(updateApprovalStatus); // Specific check for reviewer is in the controller

module.exports = router;
