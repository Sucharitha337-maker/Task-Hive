const pool = require('../config/db');

// Create a task
exports.createTask = async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    category,
    due_date,
    assigned_user_id,
    project_id
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO tasks
        (title, description, status, priority, category, due_date, assigned_user_id, project_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, status, priority, category, due_date, assigned_user_id || null, project_id]
    );

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      taskId: result.insertId
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query(`
      SELECT 
        t.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_user_name 
      FROM tasks t
      LEFT JOIN users u ON t.assigned_user_id = u.id
    `);    
    res.json(tasks);
  } catch (err) {
    console.error('❌ MySQL error in getAllTasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks from MySQL' });
  }
};

// Get task by ID with assigned user name
exports.getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT 
        t.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_user_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_user_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    console.error('Error fetching task by ID:', err);
    res.status(500).json({ error: 'Failed to fetch task by ID' });
  }
};

// Get tasks by project with assigned user name
exports.getTasksByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const [tasks] = await pool.query(`
      SELECT 
        t.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_user_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_user_id = u.id
      WHERE t.project_id = ?
    `, [projectId]);

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks by project' });
  }
};

// Get tasks by priority (stored procedure)
exports.getTasksByPriorityValue = async (req, res) => {
  const { priority } = req.params;

  try {
    const [rows] = await pool.query('CALL GetTasksByPriority(?)', [priority]);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching priority tasks:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch by priority' });
  }
};

// Update only task priority
exports.updateTaskPriority = async (req, res) => {
  const { taskId } = req.params;
  const { newPriority } = req.body;

  if (!newPriority) {
    return res.status(400).json({ success: false, message: "Priority value is required" });
  }

  try {
    await pool.query('UPDATE tasks SET priority = ? WHERE id = ?', [newPriority, taskId]);
    res.status(200).json({ success: true, message: "Task priority updated" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res.status(500).json({ success: false, message: "Failed to update priority" });
  }
};

// Get tasks by status (stored procedure)
exports.getTasksByStatusValue = async (req, res) => {
  const { status } = req.params;

  try {
    const [rows] = await pool.query('CALL GetTasksByStatus(?)', [status]);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching status tasks:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch by status' });
  }
};

// Get overview from view
exports.getProjectTasksOverview = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ProjectTasksOverview');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching project tasks overview:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project tasks overview' });
  }
};

// Update task details (supports unassigning)
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { status, priority, due_date, description, assigned_user_id } = req.body;

  try {
    await pool.query(
      `UPDATE tasks 
       SET status = ?, priority = ?, due_date = ?, description = ?, assigned_user_id = ? 
       WHERE id = ?`,
      [status, priority, due_date, description, assigned_user_id || null, id]
    );
    res.status(200).json({ success: true, message: 'Task updated successfully' });
  } catch (error) {
    console.error('❌ Error updating task:', error);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};

// Get tasks assigned to a specific user
exports.getTasksByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [tasks] = await pool.query(`
      SELECT 
        t.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_user_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_user_id = u.id
      WHERE t.assigned_user_id = ?
      ORDER BY t.due_date ASC
    `, [userId]);

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks by user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks by user' });
  }
};
