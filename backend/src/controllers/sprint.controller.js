const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all sprints for a project
// @route   GET /api/projects/:projectId/sprints
// @access  Private
const getSprints = async (req, res) => {
  const sprints = await prisma.sprint.findMany({
    where: {
      projectId: req.projectId,
    },
    orderBy: {
        startDate: 'desc',
    }
  });
  res.json(sprints);
};

// @desc    Get a single sprint by its ID
// @route   GET /api/sprints/:id
// @access  Private
const getSprint = async (req, res) => {
  const { id } = req.params;
  const sprint = await prisma.sprint.findFirst({
    where: {
      id,
      project: {
        id: req.projectId,
      }
    },
    include: {
      tasks: true,
    },
  });

  if (sprint) {
    res.json(sprint);
  } else {
    res.status(404).json({ message: 'Sprint not found' });
  }
};

// @desc    Create a new sprint
// @route   POST /api/projects/:projectId/sprints
// @access  Private
const createSprint = async (req, res) => {
  const { name, goal, startDate, endDate } = req.body;
  if (!name || !startDate || !endDate) {
    return res.status(400).json({ message: 'Name, start date, and end date are required' });
  }

  try {
    const newSprint = await prisma.sprint.create({
      data: {
        name,
        goal,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        projectId: req.projectId,
      },
    });
    res.status(201).json(newSprint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create sprint', error });
  }
};

// @desc    Update a sprint
// @route   PUT /api/sprints/:id
// @access  Private
const updateSprint = async (req, res) => {
  const { id } = req.params;
  const { name, goal, startDate, endDate, status } = req.body;

  try {
    const updatedSprint = await prisma.sprint.update({
      where: { id },
      data: {
        name,
        goal,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
      },
    });
    res.json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update sprint', error });
  }
};

// @desc    Delete a sprint
// @route   DELETE /api/sprints/:id
// @access  Private
const deleteSprint = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.sprint.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sprint', error });
  }
};

module.exports = {
  getSprints,
  getSprint,
  createSprint,
  updateSprint,
  deleteSprint,
};