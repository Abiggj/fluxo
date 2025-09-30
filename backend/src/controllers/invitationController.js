const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.inviteUser = async (req, res, next) => {
  const { email, projectId, roleId } = req.body;
  const inviterId = req.user.id;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: inviterId,
          },
        },
      },
    });

    if (!project) {
      return res.status(403).json({ message: "You don't have access to this project" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const isAlreadyMember = await prisma.userProject.findFirst({
        where: {
          userId: existingUser.id,
          projectId,
        },
      });
      if (isAlreadyMember) {
        return res.status(400).json({ message: "User is already a member of this project" });
      }
    }

    const invitation = await prisma.invitation.create({
      data: {
        email,
        inviterId,
        projectId,
        roleId,
      },
    });

    res.status(201).json({ message: "Invitation sent", invitation });
  } catch (err) {
    next(err);
  }
};

exports.acceptInvitation = async (req, res, next) => {
  const { invitationId } = req.body;
  const userId = req.user.id;

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.status !== "PENDING") {
      return res.status(400).json({ error: "Invalid or expired invitation" });
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
    });

    await prisma.userProject.create({
      data: {
        userId,
        projectId: invitation.projectId,
      },
    });

    res.json({ message: "Invitation accepted and access granted" });
  } catch (err) {
    next(err);
  }
};

exports.declineInvitation = async (req, res, next) => {
  const { invitationId } = req.body;

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.status !== "PENDING") {
      return res.status(400).json({ error: "Invalid or expired invitation" });
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: "DECLINED" },
    });

    res.json({ message: "Invitation declined" });
  } catch (err) {
    next(err);
  }
};

exports.getInvitations = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        projectId,
      },
    });
    res.json(invitations);
  } catch (err) {
    next(err);
  }
};