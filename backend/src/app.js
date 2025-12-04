const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/orgs', require('./routes/org.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/sprints', require('./routes/sprint.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/users', require('./routes/user.routes'));

const { errorHandler } = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = { app, prisma };