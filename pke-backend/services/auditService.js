/**
 * Audit Service
 * Tracks all PKE actions for compliance and debugging
 * 
 * From PKE Workflow: "Course record objects + audit log"
 */

const AuditLog = require('../models/AuditLog');

/**
 * Log a general action
 */
const log = async ({
  action,
  userId,
  userEmail,
  courseId,
  courseTitle,
  invocation,
  metadata,
  success = true,
  errorMessage,
}) => {
  try {
    const logEntry = new AuditLog({
      action,
      userId,
      userEmail,
      courseId,
      courseTitle,
      invocation,
      metadata,
      success,
      errorMessage,
    });

    await logEntry.save();
    return logEntry;
  } catch (error) {
    console.error('Audit log error:', error);
    // Don't throw - audit failures shouldn't break main flow
  }
};

/**
 * Log invocation start/complete
 */
const logInvocation = async ({
  invocation,
  courseId,
  userId,
  input,
  output,
  evidenceGrade,
  duration,
  llmDetails,
}) => {
  return log({
    action: 'INVOCATION_COMPLETED',
    userId,
    courseId,
    invocation: {
      number: invocation,
      input,
      output,
      evidenceGrade,
      duration,
    },
    llmDetails,
    success: true,
  });
};

/**
 * Log invocation error
 */
const logInvocationError = async ({
  invocation,
  courseId,
  userId,
  error,
  duration,
}) => {
  return log({
    action: 'INVOCATION_FAILED',
    userId,
    courseId,
    invocation: {
      number: invocation,
      duration,
    },
    success: false,
    errorMessage: error,
  });
};

/**
 * Log course creation
 */
const logCourseCreated = async ({ courseId, userId }) => {
  return log({
    action: 'COURSE_CREATED',
    userId,
    courseId,
  });
};

/**
 * Log export generation
 */
const logExport = async ({ courseId, userId, format, success, error }) => {
  return log({
    action: 'EXPORT_GENERATED',
    userId,
    courseId,
    metadata: { format },
    success,
    errorMessage: error,
  });
};

/**
 * Get audit trail for a course
 */
const getCourseAuditTrail = async (courseId, options = {}) => {
  const { limit = 100, startDate, endDate } = options;

  const query = { courseId };
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  return AuditLog.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Get audit trail for a user
 */
const getUserAuditTrail = async (userId, options = {}) => {
  const { limit = 100, actions } = options;

  const query = { userId };
  if (actions && actions.length > 0) {
    query.action = { $in: actions };
  }

  return AuditLog.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Get invocation statistics
 */
const getInvocationStats = async (timeRange = '7d') => {
  const days = parseInt(timeRange) || 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return AuditLog.aggregate([
    {
      $match: {
        action: { $in: ['INVOCATION_COMPLETED', 'INVOCATION_FAILED'] },
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          invocation: '$invocation.number',
          success: '$success',
        },
        count: { $sum: 1 },
        avgDuration: { $avg: '$invocation.duration' },
      },
    },
    {
      $sort: { '_id.invocation': 1 },
    },
  ]);
};

/**
 * Clean old audit logs (if not using TTL index)
 */
const cleanOldLogs = async (daysToKeep = 90) => {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

  const result = await AuditLog.deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  return result.deletedCount;
};

module.exports = {
  log,
  logInvocation,
  logInvocationError,
  logCourseCreated,
  logExport,
  getCourseAuditTrail,
  getUserAuditTrail,
  getInvocationStats,
  cleanOldLogs,
};
