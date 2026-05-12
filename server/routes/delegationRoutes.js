const express = require('express');
const router = express.Router();
const { getDelegations, createDelegation } = require('../controllers/delegationController');

router.get('/', getDelegations);
router.post('/', createDelegation);

module.exports = router;