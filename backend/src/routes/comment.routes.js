const express = require('express');
const { PrismaClient, ActivityType } = require('@prisma/client');
const { logActivity } = require('../utils/activityLogger');

const prisma = new PrismaClient();

// Controller logic within the routes file for simplicity
const createComment = async (req, res) => {
  const { body, targetId, targetType } = req.body;
  const authorId = req.user.id;

  if (!body || !targetId || !targetType) {
    return res.status(400).json({ message: 'Body, targetId, and targetType are required.' });
  }

  // Determine the connections based on targetType
  let projectConnection = {};
  let taskConnection = {};
  let crConnection = {};
  let sprintConnection = {};

  switch (targetType) {
    case 'Project':
      projectConnection = { connect: { id: targetId } };
      break;
    case 'Task':
      taskConnection = { connect: { id: targetId } };
      break;
    case 'ChangeRequest':
      crConnection = { connect: { id: targetId } };
      break;
    case 'Sprint':
      sprintConnection = { connect: { id: targetId } };
      break;
    default:
      return res.status(400).json({ message: 'Invalid targetType.' });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        body,
        authorId,
        targetId,
        targetType,
        project: projectConnection.connect ? { connect: { id: req.projectId } } : undefined,
        task: taskConnection,
        changeRequest: crConnection,
        sprint: sprintConnection,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      }
    });

    await logActivity({
        actorId: authorId,
        type: ActivityType.COMMENT_CREATED,
        targetId: targetId,
        targetType: targetType,
        projectId: req.projectId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Failed to create comment:", error);
    res.status(500).json({ message: 'Failed to create comment.' });
  }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' });
    }

    // Check if user is author or a project manager
    if (comment.authorId !== req.user.id && req.projectMembership.role !== 'MANAGER') {
        return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(204).send();
};


// Router setup
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth.middleware');
const { checkProjectMembership } = require('../middleware/project.middleware');

router.use(protect, checkProjectMembership);

router.route('/').post(createComment);
router.route('/:commentId').delete(deleteComment);

module.exports = router;
