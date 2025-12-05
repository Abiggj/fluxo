const { ProjectRole } = require('@prisma/client');

/**
 * Creates a middleware function that checks if the user has one of the allowed project roles.
 * This middleware MUST run AFTER checkProjectMembership, as it relies on req.projectMembership.
 * 
 * @param {ProjectRole[]} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {Function} Express middleware function.
 */
const hasProjectRole = (allowedRoles) => {
  return (req, res, next) => {
    const { projectMembership } = req;

    if (!projectMembership) {
      console.error('RBAC Error: hasProjectRole middleware ran before checkProjectMembership.');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    if (allowedRoles.includes(projectMembership.role)) {
      return next();
    }

    return res.status(403).json({ 
      message: 'You do not have the required permissions for this action.',
      requiredRoles: allowedRoles,
      yourRole: projectMembership.role
    });
  };
};

module.exports = { hasProjectRole };
