/**
 * Admin Routes
 * Administrative functions for PKE management
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireAdmin);

// =============================================================================
// DASHBOARD
// =============================================================================

router.get('/stats', adminController.getStats);
router.get('/audit-logs', adminController.getAuditLogs);

// =============================================================================
// USER MANAGEMENT
// =============================================================================

router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/status', adminController.updateUserStatus);

// =============================================================================
// COURSE MANAGEMENT
// =============================================================================

router.get('/courses', adminController.getAllCourses);
router.delete('/courses/:id', adminController.forceDeleteCourse);

// =============================================================================
// KNOWLEDGE PACKS (Grade B Evidence)
// =============================================================================

router.get('/knowledge-packs', adminController.getKnowledgePacks);
router.post('/knowledge-packs', adminController.createKnowledgePack);
router.put('/knowledge-packs/:id', adminController.updateKnowledgePack);
router.delete('/knowledge-packs/:id', adminController.deleteKnowledgePack);

// =============================================================================
// TEMPLATES (Grade A Evidence)
// =============================================================================

router.get('/templates', adminController.getTemplates);
router.post('/templates', adminController.uploadTemplate);
router.delete('/templates/:id', adminController.deleteTemplate);

module.exports = router;
