const db = require('../config/db');

const Task = {
  create: (title, description, status, priority, category, dueDate, assignedUserId) => {
    return db.execute(
      'INSERT INTO tasks (title, description, status, priority, category, due_date, assigned_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, status, priority, category, dueDate, assignedUserId]
    );
  },
  findAll: () => db.execute('SELECT * FROM tasks'),
};

module.exports = Task;
