const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get organization
// @route   GET /api/orgs/:slug
// @access  Private
const getOrg = async (req, res) => {
  res.status(200).json({ message: 'getOrg' });
};

module.exports = {
  getOrg,
};
