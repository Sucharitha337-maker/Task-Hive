const db = require('../config/db');

const Comment = {
  create: (taskId, userId, content) => {
    return db.execute(
      'INSERT INTO comments (task_id, user_id, content, timestamp) VALUES (?, ?, ?, NOW())',
      [taskId, userId, content]
    );
  },
  findByTaskId: (taskId) => {
    return db.execute('SELECT * FROM comments WHERE task_id = ?', [taskId]);
  },
  findByUserId: (userId) => {
    return db.execute('SELECT * FROM comments WHERE user_id = ?', [userId]);
  }
};

module.exports = Comment;
