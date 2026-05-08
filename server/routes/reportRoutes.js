const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  submitReport,
  reviewReport
} = require('../controllers/reportController');
const verifyToken = require('../middleware/auth');

// POST /api/reports — create a report
router.post('/', verifyToken, createReport);

// GET /api/reports — get all reports
router.get('/', verifyToken, getReports);

// GET /api/reports/:id — get a single report
router.get('/:id', verifyToken, getReportById);

// PUT /api/reports/:id/submit — submit a report
router.put('/:id/submit', verifyToken, submitReport);

// PUT /api/reports/:id/review — approve or reject a report
router.put('/:id/review', verifyToken, reviewReport);

module.exports = router;