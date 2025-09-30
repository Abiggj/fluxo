const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role.name }, JWT_SECRET, { expiresIn: "7d" });
};

const formatUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, roleId } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, roleId },
      include: { role: true },
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { role: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};
