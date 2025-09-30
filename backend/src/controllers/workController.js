const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createWork = async (req, res, next) => {
  const { projectId, description, goal, duration, dueDate, teamId, progressTrackingMethod, gitRepositoryUrl, gitBranch } = req.body;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!project) {
      return res.status(403).json({ message: "You don't have access to this project" });
    }

    const work = await prisma.work.create({
      data: {
        projectId,
        description,
        goal,
        duration,
        dueDate,
        progressTrackingMethod,
        gitRepositoryUrl,
        gitBranch,
        teams: teamId ? { create: { teamId } } : undefined,
      },
    });
    res.status(201).json(work);
  } catch (err) {
    next(err);
  }
};

exports.getWorks = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const works = await prisma.work.findMany({
      where: {
        projectId,
        project: {
          members: {
            some: {
              userId: req.user.id,
            },
          },
        },
      },
    });
    res.json(works);
  } catch (err) {
    next(err);
  }
};

exports.getWorkById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const work = await prisma.work.findFirst({
      where: {
        id,
        project: {
          members: {
            some: {
              userId: req.user.id,
            },
          },
        },
      },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
        assignees: {
          include: {
            user: true,
          },
        },
        tasks: true,
      },
    });

    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }

    res.json(work);
  } catch (err) {
    next(err);
  }
};

exports.updateWork = async (req, res, next) => {
  const { id } = req.params;
  const { description, goal, duration, dueDate, teamId, progressTrackingMethod, gitRepositoryUrl, gitBranch } = req.body;
  try {
    const work = await prisma.work.update({
      where: { id },
      data: { 
        description, 
        goal, 
        duration, 
        dueDate, 
        progressTrackingMethod,
        gitRepositoryUrl,
        gitBranch,
        teams: teamId ? { create: { teamId } } : undefined,
       },
    });
    res.json(work);
  } catch (err) {
    next(err);
  }
};

exports.deleteWork = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.work.delete({ where: { id } });
    res.json({ message: "Work deleted" });
  } catch (err) {
    next(err);
  }
};
