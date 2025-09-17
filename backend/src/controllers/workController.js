const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Work
exports.createWork = async (req, res) => {
  try {
    const { description, goal, dueDate, projectId } = req.body;
    const work = await prisma.work.create({
      data: {
        description,
        goal,
        dueDate,
        projectId,
      },
    });
    res.status(201).json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Works
exports.getWorks = async (req, res) => {
  try {
    const works = await prisma.work.findMany({ include: { project: true, teams: true, assignees: true, tasks: true } });
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Work
exports.updateWork = async (req, res) => {
  try {
    const { description, goal, dueDate } = req.body;
    const work = await prisma.work.update({
      where: { id: req.params.id },
      data: { description, goal, dueDate },
    });
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Work
exports.deleteWork = async (req, res) => {
  try {
    await prisma.work.delete({ where: { id: req.params.id } });
    res.json({ message: "Work deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
