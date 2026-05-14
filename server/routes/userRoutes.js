const express = require('express');
const router = express.Router();
const { getUsers, getDepartmentHeads } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getUsers);
router.get('/heads', verifyToken, getDepartmentHeads);

module.exports = router;