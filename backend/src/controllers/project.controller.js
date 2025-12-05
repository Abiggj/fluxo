const { PrismaClient, ActivityType } = require('@prisma/client');
const { logActivity } = require('../utils/activityLogger');
const prisma = new PrismaClient();

// @desc    Get all projects for the user's organization
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      orgId: req.user.orgId,
      // Also check if user is a member of the project
      members: {
        some: {
          userId: req.user.id,
        },
      },
    },
  });
  res.json(projects);
};

// @desc    Get a single project by its ID
// @route   GET /api/projects/:projectId
// @access  Private (Project Member)
const getProject = async (req, res) => {
  const { projectId } = req.params;
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      orgId: req.user.orgId,
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      sprints: true,
    },
  });

  // The middleware already confirms the project exists and user is a member.
  res.json(project);
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Org Admin/Owner)
const createProject = async (req, res) => {
  // Org-level role check remains here as it's not project-specific
  if (req.user.orgRole !== 'OWNER' && req.user.orgRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Not authorized to create projects' });
  }

  const { name, description, key, startDate, endDate } = req.body;
  if (!name || !key) {
    return res.status(400).json({ message: 'Project name and key are required' });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        key,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        orgId: req.user.orgId,
        members: {
          create: {
            userId: req.user.id,
            role: 'MANAGER',
          },
        },
      },
    });

    // Log activity
    await logActivity({
      actorId: req.user.id,
      type: ActivityType.PROJECT_CREATED,
      targetId: newProject.id,
      targetType: 'Project',
      projectId: newProject.id,
    });

    res.status(201).json(newProject);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Project key already exists' });
    }
    res.status(500).json({ message: 'Failed to create project', error });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:projectId
// @access  Private (Project Manager)
const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description, key, startDate, endDate, status } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        key,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
      },
    });

    await logActivity({
      actorId: req.user.id,
      type: ActivityType.PROJECT_UPDATED,
      targetId: updatedProject.id,
      targetType: 'Project',
      projectId: updatedProject.id,
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:projectId
// @access  Private (Project Manager)
const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    
    // Note: Activity may be deleted if cascade is set up. 
    // A soft delete strategy would be better for preserving history.

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error });
  }
};

// @desc    Add a member to a project
// @route   POST /api/projects/:projectId/members
// @access  Private (Project Manager)
const addProjectMember = async (req, res) => {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    if (!userId || !role) {
        return res.status(400).json({ message: 'User ID and role are required' });
    }

    try {
        const newMember = await prisma.projectMember.create({
            data: {
                projectId: projectId,
                userId,
                role,
            },
        });

        await logActivity({
          actorId: req.user.id,
          type: ActivityType.PROJECT_MEMBER_ADDED,
          targetId: userId, // Target is the user being added
          targetType: 'User',
          projectId: projectId,
          details: { role: role }
        });

        res.status(201).json(newMember);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'User is already a member of this project' });
        }
        res.status(500).json({ message: 'Failed to add member', error });
    }
};

// @desc    Update a project member's role
// @route   PUT /api/projects/:projectId/members/:memberId
// @access  Private (Project Manager)
const updateProjectMember = async (req, res) => {
  const { projectId, memberId } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Role is required' });
  }

  try {
    const updatedMember = await prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId: memberId,
          projectId: projectId,
        },
      },
      data: {
        role,
      },
    });

    await logActivity({
      actorId: req.user.id,
      type: ActivityType.PROJECT_MEMBER_ROLE_CHANGED,
      targetId: memberId,
      targetType: 'User',
      projectId: projectId,
      details: { newRole: role }
    });

    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update member role', error });
  }
};

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:projectId/members/:memberId
// @access  Private (Project Manager)
const removeProjectMember = async (req, res) => {
    const { projectId, memberId } = req.params;

    // Prevent manager from removing themselves if they are the last one
    if (req.user.id === memberId) {
        const otherManagers = await prisma.projectMember.count({
            where: { projectId: projectId, role: 'MANAGER', NOT: { userId: memberId } },
        });
        if (otherManagers === 0) {
            return res.status(400).json({ message: 'Cannot remove the last manager from the project' });
        }
    }

    try {
        await prisma.projectMember.delete({
            where: {
                userId_projectId: {
                    userId: memberId,
                    projectId: projectId,
                },
            },
        });

        await logActivity({
          actorId: req.user.id,
          type: ActivityType.PROJECT_MEMBER_REMOVED,
          targetId: memberId,
          targetType: 'User',
          projectId: projectId,
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove member', error });
    }
};


module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  updateProjectMember,
  removeProjectMember,
};
