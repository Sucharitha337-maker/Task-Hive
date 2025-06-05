const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router.post('/', commentController.addComment);
router.get('/task/:taskId', commentController.getCommentsByTask);
router.get('/user/:userId', commentController.getCommentsByUser);

module.exports = router;
