
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTask = async (req, res, next) => {
  const { workId, title, description, dueDate, status } = req.body;

  try {
    const work = await prisma.work.findFirst({
      where: {
        id: workId,
        project: {
          members: {
            some: {
              userId: req.user.id,
            },
          },
        },
      },
    });

    if (!work) {
      return res.status(403).json({ message: "You don't have access to this work" });
    }

    const task = await prisma.task.create({
      data: { workId, title, description, dueDate, status },
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  const { workId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        workId,
        work: {
          project: {
            members: {
              some: {
                userId: req.user.id,
              },
            },
          },
        },
      },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        work: {
          project: {
            members: {
              some: {
                userId: req.user.id,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { title, description, dueDate, status },
    });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
