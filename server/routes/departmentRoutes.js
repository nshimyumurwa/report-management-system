const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment } = require('../controllers/departmentController');
const verifyToken = require('../middleware/auth');

// GET /api/departments
router.get('/', verifyToken, getDepartments);

// POST /api/departments
router.post('/', verifyToken, createDepartment);

module.exports = router;