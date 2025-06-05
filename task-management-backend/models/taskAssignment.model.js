const db = require('../config/db');

const TaskAssignment = {
  assignTask: (taskId, assignedUserId) => {
    return db.execute(
      'INSERT INTO task_assignments (task_id, assigned_user_id, assigned_date) VALUES (?, ?, NOW())',
      [taskId, assignedUserId]
    );
  },
  removeAssignment: (taskId) => {
    return db.execute('DELETE FROM task_assignments WHERE task_id = ?', [taskId]);
  },
  getAssignmentsByUser: (userId) => {
    return db.execute('SELECT * FROM task_assignments WHERE assigned_user_id = ?', [userId]);
  }
};

module.exports = TaskAssignment;
