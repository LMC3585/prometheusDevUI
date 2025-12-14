/**
 * Invocation Routes
 * PKE Generation Invocations 1-5
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { requireGateB, checkInvocationPrereqs } = require('../middleware/gating');
const invocationController = require('../controllers/invocationController');

// All routes require authentication
router.use(requireAuth);

// =============================================================================
// INVOCATION 1: Course Description + Assistance Tier
// =============================================================================
router.post('/1',
  requireGateB,
  checkInvocationPrereqs(1),
  invocationController.invocation1
);

router.post('/1/accept',
  requireGateB,
  invocationController.acceptContent
);

router.post('/1/revise',
  requireGateB,
  invocationController.reviseContent
);

// =============================================================================
// INVOCATION 2: Learning Objectives
// =============================================================================
router.post('/2',
  requireGateB,
  checkInvocationPrereqs(2),
  invocationController.invocation2
);

router.post('/2/accept',
  requireGateB,
  invocationController.acceptContent
);

router.post('/2/revise',
  requireGateB,
  invocationController.reviseContent
);

// =============================================================================
// INVOCATION 3: Topics / Subtopics / Lessons / PCs
// =============================================================================
router.post('/3',
  requireGateB,
  checkInvocationPrereqs(3),
  invocationController.invocation3
);

router.post('/3/accept',
  requireGateB,
  invocationController.acceptContent
);

router.post('/3/revise',
  requireGateB,
  invocationController.reviseContent
);

// =============================================================================
// INVOCATION 4: Full Course Build
// =============================================================================
router.post('/4',
  requireGateB,
  checkInvocationPrereqs(4),
  invocationController.invocation4
);

router.post('/4/accept',
  requireGateB,
  invocationController.acceptContent
);

router.post('/4/revise',
  requireGateB,
  invocationController.reviseContent
);

// =============================================================================
// INVOCATION 5: Template Mapping (Admin Only)
// =============================================================================
router.post('/5',
  requireAdmin,
  invocationController.invocation5
);

router.post('/5/apply',
  requireAdmin,
  invocationController.applyTemplateMapping
);

module.exports = router;
