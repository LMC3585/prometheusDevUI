/**
 * Audit Log Model
 * Tracks all PKE actions for compliance and debugging
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // What happened
  action: {
    type: String,
    required: true,
    enum: [
      'COURSE_CREATED',
      'COURSE_UPDATED',
      'COURSE_DELETED',
      'INVOCATION_STARTED',
      'INVOCATION_COMPLETED',
      'INVOCATION_FAILED',
      'CONTENT_ACCEPTED',
      'CONTENT_REVISED',
      'GATE_PASSED',
      'EXPORT_GENERATED',
      'USER_LOGIN',
      'USER_LOGOUT',
      'ADMIN_ACTION',
    ],
  },

  // Who did it
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userEmail: String,

  // What was affected
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  courseTitle: String,

  // Invocation details
  invocation: {
    number: Number,
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    evidenceGrade: String,
    duration: Number,  // milliseconds
  },

  // LLM details (for debugging)
  llmDetails: {
    provider: String,
    model: String,
    promptTokens: Number,
    completionTokens: Number,
    totalTokens: Number,
  },

  // Result
  success: {
    type: Boolean,
    default: true,
  },
  errorMessage: String,

  // Context
  metadata: {
    ipAddress: String,
    userAgent: String,
    sessionId: String,
  },

}, {
  timestamps: true,
});

// Indexes for querying
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ courseId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

// Auto-expire old logs (optional - 90 days)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
