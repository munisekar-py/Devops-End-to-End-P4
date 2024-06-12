const express = require('express');
const router = express.Router();
const projectContentController = require('../controllers/projectContent.controller');

router.post('/', projectContentController.createProject);
router.get('/', projectContentController.getAllProjectLinks);
router.put('/:id', projectContentController.updateProjectContent)
router.delete('/:id', projectContentController.deleteProjectContent)

module.exports = router;
