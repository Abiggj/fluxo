const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get sprints
// @route   GET /api/sprints
// @access  Private
const getSprints = async (req, res) => {
  res.status(200).json({ message: 'getSprints' });
};

// @desc    Get sprint
// @route   GET /api/sprints/:id
// @access  Private
const getSprint = async (req, res) => {
  res.status(200).json({ message: 'getSprint' });
};

// @desc    Create sprint
// @route   POST /api/sprints
// @access  Private
const createSprint = async (req, res) => {
  res.status(200).json({ message: 'createSprint' });
};

// @desc    Update sprint
// @route   PUT /api/sprints/:id
// @access  Private
const updateSprint = async (req, res) => {
  res.status(200).json({ message: 'updateSprint' });
};

// @desc    Delete sprint
// @route   DELETE /api/sprints/:id
// @access  Private
const deleteSprint = async (req, res) => {
  res.status(200).json({ message: 'deleteSprint' });
};

module.exports = {
  getSprints,
  getSprint,
  createSprint,
  updateSprint,
  deleteSprint,
};
