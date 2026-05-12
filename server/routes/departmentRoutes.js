const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment } = require('../controllers/departmentController');
const verifyToken = require('../middleware/auth');

// GET /api/departments — no auth needed to list departments
router.get('/', getDepartments);

// POST /api/departments — protected
router.post('/', verifyToken, createDepartment);

module.exports = router;