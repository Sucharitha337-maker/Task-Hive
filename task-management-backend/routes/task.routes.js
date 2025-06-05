const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// Add new routes for stored procedures and views
router.post('/', taskController.createTask);
router.get('/by-priority/:priority', taskController.getTasksByPriorityValue);
router.get('/by-status/:status', taskController.getTasksByStatusValue);
router.get('/project-overview', taskController.getProjectTasksOverview);
router.get('/project/:projectId', taskController.getTasksByProject);
router.patch('/:taskId/priority', taskController.updateTaskPriority);

router.get('/assigned/:userId', taskController.getTasksByUserId);

// Main task routes
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);


router.get('/:id', taskController.getTaskById);

module.exports = router;
