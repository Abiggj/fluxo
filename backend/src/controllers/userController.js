const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateMyPassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};