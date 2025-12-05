const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Logs an activity to the database.
 * @param {object} activityData
 * @param {string} activityData.actorId - The ID of the user who performed the action.
 * @param {import('@prisma/client').ActivityType} activityData.type - The type of activity.
 * @param {string} activityData.targetId - The ID of the entity that was acted upon.
 * @param {string} activityData.targetType - The type of the entity (e.g., "Project", "Task").
 * @param {object} [activityData.details] - Optional JSON object for extra details (e.g., before/after state).
 * @param {string} [activityData.projectId] - Optional: The project associated with the activity.
 * @param {string} [activityData.taskId] - Optional: The task associated with the activity.
 * @param {string} [activityData.changeRequestId] - Optional: The change request associated with the activity.
 */
const logActivity = async (activityData) => {
  const { actorId, type, targetId, targetType, details, projectId, taskId, changeRequestId } = activityData;

  try {
    await prisma.activity.create({
      data: {
        actorId,
        type,
        targetId,
        targetType,
        details: details || undefined,
        // Connect to the main entities for easier querying
        projectId: projectId || undefined,
        taskId: taskId || undefined,
        changeRequestId: changeRequestId || undefined,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // We don't want to fail the parent request if logging fails,
    // so we just log the error and continue.
  }
};

module.exports = { logActivity };
