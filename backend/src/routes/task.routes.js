const express = require('express');
const projectTaskRouter = express.Router({ mergeParams: true });
const taskRouter = express.Router();

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkProjectMembership } = require('../middleware/project.middleware');

// All routes are protected
projectTaskRouter.use(protect, checkProjectMembership);
taskRouter.use(protect, checkProjectMembership);

// --- Routes nested under /api/projects/:projectId/tasks ---
projectTaskRouter.route('/')
  .get(getTasks)
  .post(createTask);

// --- Standalone routes for /api/tasks/:id ---
taskRouter.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = { projectTaskRouter, taskRouter };