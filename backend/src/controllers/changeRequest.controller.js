const { PrismaClient, ActivityType, ChangeRequestStatus, ApprovalStatus } = require('@prisma/client');
const { logActivity } = require('../utils/activityLogger');
const prisma = new PrismaClient();

// @desc    Get all change requests for a project
// @route   GET /api/projects/:projectId/cr
// @access  Private (Project Member)
const getChangeRequestsForProject = async (req, res) => {
  const { projectId } = req.params;

  const changeRequests = await prisma.changeRequest.findMany({
    where: { projectId },
    include: {
      proposer: { select: { id: true, name: true, avatarUrl: true } },
      approvals: {
        include: {
          reviewer: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(changeRequests);
};

// @desc    Get a single change request
// @route   GET /api/cr/:id
// @access  Private (Project Member)
const getChangeRequest = async (req, res) => {
  const { id } = req.params;

  const changeRequest = await prisma.changeRequest.findUnique({
    where: { id },
    include: {
      proposer: { select: { id: true, name: true, avatarUrl: true } },
      approvals: {
        include: {
          reviewer: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
      comments: {
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      activities: {
        include: {
          actor: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!changeRequest) {
    return res.status(404).json({ message: 'Change Request not found' });
  }

  res.json(changeRequest);
};

// @desc    Create a new change request
// @route   POST /api/projects/:projectId/cr
// @access  Private (Project Member)
const createChangeRequest = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, approvals } = req.body; // approvals: [{ reviewerId: '...' }]

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const newCR = await prisma.changeRequest.create({
      data: {
        projectId,
        proposerId: req.user.id,
        title,
        description,
        approvals: approvals && approvals.length > 0 ? {
          create: approvals.map(appr => ({
            reviewerId: appr.reviewerId,
            status: ApprovalStatus.PENDING,
          })),
        } : undefined,
      },
    });

    await logActivity({
      actorId: req.user.id,
      type: ActivityType.CHANGE_REQUEST_CREATED,
      targetId: newCR.id,
      targetType: 'ChangeRequest',
      projectId,
      changeRequestId: newCR.id,
    });

    res.status(201).json(newCR);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create change request' });
  }
};

// @desc    Update a change request's details
// @route   PUT /api/cr/:id
// @access  Private (Proposer or Manager)
const updateChangeRequest = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const updatedCR = await prisma.changeRequest.update({
            where: { id },
            data: { title, description },
        });
        res.json(updatedCR);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update change request' });
    }
};

// @desc    Update a change request's status
// @route   PUT /api/cr/:id/status
// @access  Private (Manager)
const updateChangeRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ChangeRequestStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const updatedCR = await prisma.changeRequest.update({
            where: { id },
            data: { status },
        });

        await logActivity({
            actorId: req.user.id,
            type: ActivityType.CHANGE_REQUEST_IMPLEMENTED, // Generic, should be more specific
            targetId: updatedCR.id,
            targetType: 'ChangeRequest',
            projectId: updatedCR.projectId,
            changeRequestId: updatedCR.id,
            details: { status }
        });

        res.json(updatedCR);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update change request status' });
    }
};

// @desc    Update an approval status for a change request
// @route   PUT /api/cr/:id/approvals/:approvalId
// @access  Private (Assigned Reviewer)
const updateApprovalStatus = async (req, res) => {
    const { approvalId } = req.params;
    const { status, comment } = req.body;

    if (!Object.values(ApprovalStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid approval status' });
    }

    const approval = await prisma.changeRequestApproval.findUnique({ where: { id: approvalId }});

    if (approval.reviewerId !== req.user.id) {
        return res.status(403).json({ message: 'You are not the assigned reviewer for this approval.' });
    }

    try {
        const updatedApproval = await prisma.changeRequestApproval.update({
            where: { id: approvalId },
            data: { status, comment },
        });

        const cr = await prisma.changeRequest.findUnique({ where: { id: approval.changeRequestId }});

        await logActivity({
            actorId: req.user.id,
            type: status === ApprovalStatus.APPROVED ? ActivityType.CHANGE_REQUEST_APPROVED : ActivityType.CHANGE_REQUEST_REJECTED,
            targetId: cr.id,
            targetType: 'ChangeRequest',
            projectId: cr.projectId,
            changeRequestId: cr.id,
            details: { reviewer: req.user.name, approvalStatus: status }
        });

        res.json(updatedApproval);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update approval status' });
    }
};


module.exports = {
  getChangeRequestsForProject,
  getChangeRequest,
  createChangeRequest,
  updateChangeRequest,
  updateChangeRequestStatus,
  updateApprovalStatus,
};
