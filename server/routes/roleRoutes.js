const express = require('express');
const router = express.Router();
const { getRoles, createRole } = require('../controllers/roleController');
const verifyToken = require('../middleware/auth');

// GET /api/roles
router.get('/', verifyToken, getRoles);

// POST /api/roles
router.post('/', verifyToken, createRole);

module.exports = router;