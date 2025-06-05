const express = require('express');
const router = express.Router();
const taskAssignmentController = require('../controllers/taskAssignment.controller');

// Existing routes...

// New routes for stored procedures
router.post('/assign', taskAssignmentController.assignTaskToUser);
router.delete('/:taskId/user/:userId', taskAssignmentController.removeUserFromTask);
router.get('/:taskId/history', taskAssignmentController.getTaskAssignmentHistory);

module.exports = router;
