const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');

// GET /api/dashboard/stats - Retrieve dashboard summary statistics
router.get('/stats', getDashboardStats);

module.exports = router;
