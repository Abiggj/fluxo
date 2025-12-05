const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  updateProjectMember,
  removeProjectMember,
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkProjectMembership } = require('../middleware/project.middleware');
const { hasProjectRole } = require('../middleware/rbac.middleware');
const { ProjectRole } = require('@prisma/client');

// All routes in this file are protected
router.use(protect);

// Routes for an organization's projects
router.route('/')
  .get(getProjects)
  .post(createProject); // Org-level permission should be checked in controller

// Routes for a specific project
// All subsequent routes in this chain will have project membership checked
router.use('/:projectId', checkProjectMembership);

router.route('/:projectId')
  .get(hasProjectRole([ProjectRole.MANAGER, ProjectRole.DESIGNER, ProjectRole.DEVELOPER, ProjectRole.QA, ProjectRole.VIEWER]), getProject)
  .put(hasProjectRole([ProjectRole.MANAGER]), updateProject)
  .delete(hasProjectRole([ProjectRole.MANAGER]), deleteProject);

router.route('/:projectId/members')
    .post(hasProjectRole([ProjectRole.MANAGER]), addProjectMember);

router.route('/:projectId/members/:memberId')
    .put(hasProjectRole([ProjectRole.MANAGER]), updateProjectMember)
    .delete(hasProjectRole([ProjectRole.MANAGER]), removeProjectMember);

module.exports = router;
