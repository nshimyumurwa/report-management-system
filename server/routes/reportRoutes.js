const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  getReportApprovals,
  submitReport,
  reviewReport
} = require('../controllers/reportController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, createReport);
router.get('/', verifyToken, getReports);
router.get('/:id', verifyToken, getReportById);
router.get('/:id/approvals', verifyToken, getReportApprovals);
router.put('/:id/submit', verifyToken, submitReport);
router.put('/:id/review', verifyToken, reviewReport);

module.exports = router;