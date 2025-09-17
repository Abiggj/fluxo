const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Team
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const team = await prisma.team.create({ data: { name, description } });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({ include: { users: true, projects: true, works: true } });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Team
exports.updateTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const team = await prisma.team.update({
      where: { id: req.params.id },
      data: { name, description },
    });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Team
exports.deleteTeam = async (req, res) => {
  try {
    await prisma.team.delete({ where: { id: req.params.id } });
    res.json({ message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
