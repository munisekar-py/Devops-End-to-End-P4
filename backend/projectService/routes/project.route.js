const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { upload } = require('../utils/s3config');


// CRUD routes
router.post('/',upload.single('image'), projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Listing and searching
router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProjectById)
router.get('/paginated', projectController.getProjectsWithPagination);
router.get('/search', projectController.searchProjects);
router.get('/images/:key', projectController.streamImage);


module.exports = router;
