const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  res.status(200).json({ message: 'getTasks' });
};

// @desc    Get task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  res.status(200).json({ message: 'getTask' });
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  res.status(200).json({ message: 'createTask' });
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  res.status(200).json({ message: 'updateTask' });
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  res.status(200).json({ message: 'deleteTask' });
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
