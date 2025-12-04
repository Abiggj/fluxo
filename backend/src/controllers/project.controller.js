const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  res.status(200).json({ message: 'getProjects' });
};

// @desc    Get project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  res.status(200).json({ message: 'getProject' });
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  res.status(200).json({ message: 'createProject' });
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  res.status(200).json({ message: 'updateProject' });
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  res.status(200).json({ message: 'deleteProject' });
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
