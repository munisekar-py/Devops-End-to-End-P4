const express = require('express');
const router = express.Router();
const projectDomainController = require('../controllers/projectDomain.controller');

router.post('/', projectDomainController.createProjectDomain);
router.get('/', projectDomainController.getAllProjectDomains);
router.get('/:id', projectDomainController.getProjectDomainById);
router.put('/:id', projectDomainController.updateProjectDomain);
router.delete('/:id', projectDomainController.deleteProjectDomain);

module.exports = router;
