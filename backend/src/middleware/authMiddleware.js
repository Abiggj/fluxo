const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { role: { include: { permissions: true } } },
      });

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.permissions) {
      return res.status(403).json({ message: "Forbidden: user role or permissions not available" });
    }
    const userPermissions = req.user.role.permissions.map((p) => p.name);
    const hasPermission = permissions.every((p) => userPermissions.includes(p));

    if (hasPermission) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
  };
};

module.exports = { protect, authorize };
