const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createProject = async (req, res, next) => {
  const { name, description } = req.body;
  const { id: ownerId } = req.user;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId,
        members: {
          create: {
            userId: ownerId,
          },
        },
      },
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: req.user.id,
          },
        },
      },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findFirst({
      where: {
        id,
        members: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        works: true,
        teams: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { name, description },
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id } });
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};
