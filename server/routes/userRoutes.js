const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');

// GET /api/users — public for now
router.get('/', getUsers);

module.exports = router;