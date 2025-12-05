const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Route Imports ---
const authRoutes = require('./routes/auth.routes');
const orgRoutes = require('./routes/org.routes');
const projectRoutes = require('./routes/project.routes');
const userRoutes = require('./routes/user.routes');
const { projectSprintRouter, sprintRouter } = require('./routes/sprint.routes');
const { projectTaskRouter, taskRouter } = require('./routes/task.routes');

// NEW: Change Request and Comment Routes
const changeRequestRoutes = require('./routes/changeRequest.routes');
const commentRoutes = require('./routes/comment.routes');
const { getChangeRequestsForProject, createChangeRequest } = require('./controllers/changeRequest.controller');
const { protect } = require('./middleware/auth.middleware');
const { checkProjectMembership } = require('./middleware/project.middleware');


// --- Route Definitions ---

// Core routes
app.use('/api/auth', authRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Standalone resource routes
app.use('/api/sprints', sprintRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/cr', changeRequestRoutes); // NEW: For specific CRs by their own ID

// --- Nested Routes ---

// Sprints nested under projects
app.use('/api/projects/:projectId/sprints', projectSprintRouter);

// Tasks nested under projects
app.use('/api/projects/:projectId/tasks', projectTaskRouter);

// NEW: Change Requests nested under projects (for listing and creation)
const projectChangeRequestRouter = express.Router({ mergeParams: true });
projectChangeRequestRouter.use(protect, checkProjectMembership);
projectChangeRequestRouter.route('/').get(getChangeRequestsForProject).post(createChangeRequest);
app.use('/api/projects/:projectId/cr', projectChangeRequestRouter);

// NEW: Comments nested under various resources
app.use('/api/projects/:projectId/comments', commentRoutes);
app.use('/api/tasks/:id/comments', commentRoutes);
app.use('/api/cr/:id/comments', commentRoutes);
app.use('/api/sprints/:id/comments', commentRoutes);


// --- Error Handling ---
const { errorHandler } = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = { app, prisma };
