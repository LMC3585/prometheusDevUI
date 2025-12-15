/**
 * PKE Routes
 * Help mode and UI assistance endpoints
 */

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const pkeController = require('../controllers/pkeController');

router.post('/help', optionalAuth, pkeController.helpMode);
router.get('/functionality', optionalAuth, pkeController.getFunctionality);

module.exports = router;
