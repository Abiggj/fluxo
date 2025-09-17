const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const {name, email, password, roleId} = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: {email}});
    if ( existingUser ) return res.status(400).json({ message: "User already exists"});

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, roleId}
    });
    res.status(201).json({ message: "User registered successfully", user:{ id: user.id, email: user.email}});
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

exports.login = async (req, res) => {
  try{
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: {email}});
    if (!user) return res.status(404).json({ message: "User not found"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials"});

    const token = jwt.sign({ id: user.id, roleId: user.roleId}, JWT_SECRET, {expiresIn: "7d"});

    res.json({token, user: { id:user.id, email:user.email, roleId: user.roleId}});
  } catch (err) {
    res.status(500).json({error: err.message})
  }
};
