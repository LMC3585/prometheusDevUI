/**
 * Constants
 * Application-wide constants and enums
 */

const COURSE_STAGES = {
  DEFINE: 'define',
  DESIGN: 'design',
  BUILD: 'build',
  FORMAT: 'format',
  GENERATE: 'generate',
};

const GATES = {
  A: 'gateA',  // Authentication
  B: 'gateB',  // Course title saved
};

const EVIDENCE_GRADES = {
  A: 'A',  // Policy / Template Truth
  B: 'B',  // Curated Knowledge Packs
  C: 'C',  // Cited External Sources
  D: 'D',  // Heuristic Draft
};

const BLOOM_LEVELS = {
  REMEMBER: 'remember',
  UNDERSTAND: 'understand',
  APPLY: 'apply',
  ANALYZE: 'analyze',
  EVALUATE: 'evaluate',
  CREATE: 'create',
};

const BLOOM_VERBS = {
  remember: ['define', 'identify', 'list', 'name', 'recall', 'recognize', 'state'],
  understand: ['describe', 'explain', 'summarize', 'interpret', 'classify', 'compare'],
  apply: ['apply', 'demonstrate', 'implement', 'solve', 'use', 'execute'],
  analyze: ['analyze', 'differentiate', 'examine', 'compare', 'contrast', 'organize'],
  evaluate: ['evaluate', 'assess', 'critique', 'judge', 'justify', 'recommend'],
  create: ['create', 'design', 'develop', 'formulate', 'construct', 'produce'],
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

const COURSE_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

const ASSISTANCE_TIERS = {
  FULL: 'full',       // Maximum AI assistance
  GUIDED: 'guided',   // Suggestions with user control
  MINIMAL: 'minimal', // User-driven with AI validation
};

module.exports = {
  COURSE_STAGES,
  GATES,
  EVIDENCE_GRADES,
  BLOOM_LEVELS,
  BLOOM_VERBS,
  USER_ROLES,
  COURSE_STATUS,
  ASSISTANCE_TIERS,
};
