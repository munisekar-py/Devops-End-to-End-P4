const express = require('express');
const router = express.Router();
const userLeadController = require('../controllers/userLead.controller');

router.post('/', userLeadController.createUserLead);
router.get('/', userLeadController.getAllUserLeads);
router.get('/:id', userLeadController.getUserLeadById);
router.put('/:id', userLeadController.updateUserLead);
router.delete('/:id', userLeadController.deleteUserLead);

module.exports = router;
