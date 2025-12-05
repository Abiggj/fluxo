const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      org: true,
      projectMemberships: {
        include: {
          project: {
            select: { id: true, name: true, key: true }
          }
        }
      },
    },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users in the organization
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        where: { orgId: req.user.orgId },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            orgRole: true,
        }
    });
    res.json(users);
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findFirst({
        where: { 
            id,
            orgId: req.user.orgId // Ensure users can only see other users in their own org
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            orgRole: true,
            projectMemberships: {
                select: {
                    role: true,
                    project: {
                        select: { id: true, name: true, key: true }
                    }
                }
            }
        }
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update a user's details
// @route   PUT /api/users/:id
// @access  Private (Admin or self)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, avatarUrl, orgRole } = req.body;

    // Authorization: Allow user to update themselves, or an admin to update any user in the org.
    if (req.user.id !== id && req.user.orgRole !== 'ADMIN' && req.user.orgRole !== 'OWNER') {
        return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const dataToUpdate = { name, avatarUrl };

    // Only admins/owners can change a user's organization role
    if (orgRole && (req.user.orgRole === 'ADMIN' || req.user.orgRole === 'OWNER')) {
        // Prevent owner from being demoted by another admin
        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (targetUser.orgRole === 'OWNER' && req.user.id !== targetUser.id) {
             return res.status(403).json({ message: 'Cannot change the role of the organization owner' });
        }
        dataToUpdate.orgRole = orgRole;
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin/Owner)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (req.user.orgRole !== 'ADMIN' && req.user.orgRole !== 'OWNER') {
        return res.status(403).json({ message: 'Not authorized to delete users' });
    }

    if (req.user.id === id) {
        return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (targetUser.orgRole === 'OWNER') {
        return res.status(403).json({ message: 'Cannot delete the organization owner' });
    }

    try {
        await prisma.user.delete({
            where: { id, orgId: req.user.orgId },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};


module.exports = {
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};