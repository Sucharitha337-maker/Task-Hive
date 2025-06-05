const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authorizeAdmin = require('../middleware/authorizeAdmin');

// Create a new project (Admin only)
router.post('/', authorizeAdmin, projectController.create);

// Retrieve all projects (Open)
router.get('/', projectController.findAll);

// Retrieve a single project by ID (Open)
router.get('/:projectId', projectController.findOne);

// Update a project (Admin only)
router.put('/:projectId', authorizeAdmin, projectController.update);

// Delete a project (Admin only)
router.delete('/:projectId', authorizeAdmin, projectController.delete);

module.exports = router;