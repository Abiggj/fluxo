import { prisma } from "../prismaClient.js";

export const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.projectId || req.body.projectId;

    const userRole = await prisma.userRole.findFirst({
      where: { userId, projectId },
      include: { role: { include: { permissions: true } } }
    });

    if (!userRole) {
      return res.status(403).json({ error: "No access to this project" });
    }

    const hasPermission = userRole.role.permissions.some(
      (perm) => perm.name === permissionName
    );

    if (!hasPermission) {
      return res.status(403).json({ error: "Permission denied" });
    }

    next();
  };
};
