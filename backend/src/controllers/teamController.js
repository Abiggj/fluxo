const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTeam = async (req, res, next) => {
  const { name, description, projectId } = req.body;

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

    const team = await prisma.team.create({
      data: {
        name,
        description,
        projects: {
          create: {
            projectId,
          },
        },
        users: {
          create: {
            userId: req.user.id,
          },
        },
      },
    });
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
};

exports.getTeams = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const teams = await prisma.team.findMany({
      where: {
        projects: {
          some: {
            projectId,
          },
        },
      },
    });
    res.json(teams);
  } catch (err) {
    next(err);
  }
};

exports.getTeamById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const team = await prisma.team.findFirst({
      where: {
        id,
        projects: {
          some: {
            project: {
              members: {
                some: {
                  userId: req.user.id,
                },
              },
            },
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (err) {
    next(err);
  }
};

exports.updateTeam = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const team = await prisma.team.update({
      where: { id },
      data: { name, description },
    });
    res.json(team);
  } catch (err) {
    next(err);
  }
};

exports.deleteTeam = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({ where: { id } });
    res.json({ message: "Team deleted" });
  } catch (err) {
    next(err);
  }
};

exports.addUserToTeam = async (req, res, next) => {
  const { id, userId } = req.params;
  try {
    await prisma.userTeam.create({
      data: {
        teamId: id,
        userId,
      },
    });
    res.json({ message: "User added to team" });
  } catch (err) {
    next(err);
  }
};

exports.removeUserFromTeam = async (req, res, next) => {
  const { id, userId } = req.params;
  try {
    await prisma.userTeam.delete({
      where: {
        userId_teamId: {
          userId,
          teamId: id,
        },
      },
    });
    res.json({ message: "User removed from team" });
  } catch (err) {
    next(err);
  }
};
