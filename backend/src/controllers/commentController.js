const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createComment = async (req, res, next) => {
  const { content, taskId, projectId } = req.body;
  const authorId = req.user.id;

  try {
    if (taskId) {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          work: {
            project: {
              members: {
                some: {
                  userId: authorId,
                },
              },
            },
          },
        },
      });
      if (!task) {
        return res.status(403).json({ message: "You don't have access to this task" });
      }
    } else if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          members: {
            some: {
              userId: authorId,
            },
          },
        },
      });
      if (!project) {
        return res.status(403).json({ message: "You don't have access to this project" });
      }
    } else {
      return res.status(400).json({ message: "A comment must be associated with a task or a project" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        taskId,
        projectId,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.getCommentsForTask = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

exports.getCommentsForProject = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { projectId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await prisma.comment.findFirst({
      where: { id, authorId: req.user.id },
    });

    if (!comment) {
      return res.status(403).json({ message: "You don't have permission to update this comment" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    res.json(updatedComment);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const comment = await prisma.comment.findFirst({
      where: { id, authorId: req.user.id },
    });

    if (!comment) {
      return res.status(403).json({ message: "You don't have permission to delete this comment" });
    }

    await prisma.comment.delete({ where: { id } });
    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};