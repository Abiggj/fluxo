const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token){
    return res.status(401).json({ error: "Unauthorised"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id},
      include: { role: true},
    });

    if (!user) return res.status(404).json({ message: "User not found"});
    
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid authentication"})
  }
} 

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorised"});
  

    if (!allowedRoles.includes(req.user.role)){
      return res.status(403).json({ error: "Forbidden: insufficient role"});
    }

    next();
  };
};
