const express = require('express');
// We need to merge params to access projectId from the parent router
const router = express.Router({ mergeParams: true }); 
const {
  getSprints,
  getSprint,
  createSprint,
  updateSprint,
  deleteSprint,
} = require('../controllers/sprint.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkProjectMembership } = require('../middleware/project.middleware');

// All routes in this file are protected and check for project membership
router.use(protect);
router.use(checkProjectMembership);

// Routes for /api/projects/:projectId/sprints
router.route('/')
  .get(getSprints)
  .post(createSprint);

// The routes below are for /api/sprints/:id, but they still need the project membership check
const sprintRouter = express.Router();
sprintRouter.use(protect, checkProjectMembership);

sprintRouter.route('/:id')
  .get(getSprint)
  .put(updateSprint)
  .delete(deleteSprint);

// We export both routers. The main one will be mounted under projects, 
// and the sprintRouter will be mounted at the root.
module.exports = { projectSprintRouter: router, sprintRouter };