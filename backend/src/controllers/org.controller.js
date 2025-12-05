const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new organization
// @route   POST /api/orgs
// @access  Private
const createOrg = async (req, res) => {
  const { name, slug } = req.body;
  const user = req.user;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }

  try {
    const newOrg = await prisma.organization.create({
      data: {
        name,
        slug,
        users: {
          connect: { id: user.id },
        },
      },
    });

    // Update user's org and role
    await prisma.user.update({
      where: { id: user.id },
      data: {
        orgId: newOrg.id,
        orgRole: 'OWNER',
      },
    });

    res.status(201).json(newOrg);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Organization slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create organization', error });
  }
};

// @desc    Get organization by slug
// @route   GET /api/orgs/:slug
// @access  Private
const getOrg = async (req, res) => {
  const { slug } = req.params;
  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      users: true,
      projects: true,
    },
  });

  if (org) {
    res.json(org);
  } else {
    res.status(404).json({ message: 'Organization not found' });
  }
};

// @desc    Update an organization
// @route   PUT /api/orgs/:slug
// @access  Private (Owner/Admin)
const updateOrg = async (req, res) => {
  const { slug } = req.params;
  const { name, newSlug } = req.body;

  // Basic authorization: Only allow org owner/admin
  if (req.user.orgRole !== 'OWNER' && req.user.orgRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Not authorized to update this organization' });
  }

  try {
    const updatedOrg = await prisma.organization.update({
      where: { slug },
      data: {
        name,
        slug: newSlug,
      },
    });
    res.json(updatedOrg);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'New slug already exists' });
    }
    res.status(500).json({ message: 'Failed to update organization', error });
  }
};

// @desc    Delete an organization
// @route   DELETE /api/orgs/:slug
// @access  Private (Owner)
const deleteOrg = async (req, res) => {
  const { slug } = req.params;

  // Basic authorization: Only allow org owner
  if (req.user.orgRole !== 'OWNER') {
    return res.status(403).json({ message: 'Not authorized to delete this organization' });
  }

  try {
    // This is a destructive action and needs careful handling in a real app
    // (e.g., soft delete, archiving, checking for active projects)
    await prisma.organization.delete({
      where: { slug },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete organization', error });
  }
};

// @desc    Get all users in an organization
// @route   GET /api/orgs/:slug/users
// @access  Private
const getOrgUsers = async (req, res) => {
  const { slug } = req.params;
  const users = await prisma.user.findMany({
    where: {
      org: {
        slug,
      },
    },
  });
  res.json(users);
};

module.exports = {
  createOrg,
  getOrg,
  updateOrg,
  deleteOrg,
  getOrgUsers,
};