/**
 * Routes Index
 * Central routing configuration
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const courseRoutes = require('./courses');
const invokeRoutes = require('./invoke');
const pkeRoutes = require('./pke');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/invoke', invokeRoutes);
router.use('/pke', pkeRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
