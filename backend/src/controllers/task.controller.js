const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = async (req, res) => {
  // req.projectId is attached by the checkProjectMembership middleware
  const tasks = await prisma.task.findMany({
    where: {
      projectId: req.projectId,
    },
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      sprint: { select: { id: true, name: true } },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  res.json(tasks);
};

// @desc    Get a single task by its ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  const { id } = req.params;
  // req.projectId is attached by the checkProjectMembership middleware
  const task = await prisma.task.findFirst({
    where: {
      id,
      projectId: req.projectId,
    },
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      createdBy: { select: { id: true, name: true, avatarUrl: true } },
      reviewer: { select: { id: true, name: true, avatarUrl: true } },
      sprint: true,
      comments: {
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
      statusHistory: {
        include: {
          changedBy: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  });

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

// @desc    Create a new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, type, priority, sprintId, assigneeId, dueDate } = req.body;

  if (!title || !type) {
    return res.status(400).json({ message: 'Title and type are required' });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        type,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: req.projectId,
        createdById: req.user.id,
        assigneeId,
        sprintId,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, type, priority, status, sprintId, assigneeId, reviewerId, dueDate } = req.body;

  try {
    // In a real app, you might want to record status changes in the TaskStatusHistory model
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        type,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId,
        reviewerId,
        sprintId,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task', error });
  }
};

// @desc    Delete a task (soft delete)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const { id } = req.params;

  // Only project managers or admins can permanently delete.
  // Others might only be able to "archive" or soft-delete.
  // For simplicity, we'll allow any project member to soft-delete.
  try {
    await prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};