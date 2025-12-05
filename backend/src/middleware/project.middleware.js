const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check if user is a member of the project associated with a resource.
// It can find the projectId from:
// 1. req.params.projectId (for routes like /projects/:projectId/...)
// 2. The resource itself (Task, Sprint, ChangeRequest) by its ID in req.params.id
const checkProjectMembership = async (req, res, next) => {
  let projectId;

  // Case 1: Direct projectId in URL
  if (req.params.projectId) {
    projectId = req.params.projectId;
  } 
  // Case 2: Infer projectId from another resource's ID
  else if (req.params.id) {
    const resourceId = req.params.id;
    let resource = null;
    
    // Determine the resource type from the URL
    if (req.baseUrl.includes('sprints')) {
        resource = await prisma.sprint.findUnique({ where: { id: resourceId }, select: { projectId: true } });
    } else if (req.baseUrl.includes('tasks')) {
        resource = await prisma.task.findUnique({ where: { id: resourceId }, select: { projectId: true } });
    } else if (req.baseUrl.includes('cr')) { // NEW: Handle Change Requests
        resource = await prisma.changeRequest.findUnique({ where: { id: resourceId }, select: { projectId: true } });
    }
    
    if (resource) {
        projectId = resource.projectId;
    }
  }

  if (!projectId) {
    return res.status(404).json({ message: 'Associated project not found for this resource.' });
  }

  const membership = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: req.user.id,
    },
  });

  if (!membership) {
    return res.status(403).json({ message: 'You are not a member of this project.' });
  }

  // Attach project and membership info to the request for later use
  req.projectId = projectId;
  req.projectMembership = membership; 
  
  next();
};

module.exports = { checkProjectMembership };

