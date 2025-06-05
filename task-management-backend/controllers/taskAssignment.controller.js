const pool = require('../config/db');

// Existing code...

// New method to assign task to user using stored procedure
exports.assignTaskToUser = async (req, res) => {
  const { taskId, userId } = req.body;
  const assignedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  try {
    await pool.execute('CALL AssignTaskToUser(?, ?, ?)', [taskId, userId, assignedDate]);
    res.status(201).json({ success: true, message: 'Task assigned successfully' });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ success: false, message: 'Failed to assign task' });
  }
};

// New method to remove user from task assignment
exports.removeUserFromTask = async (req, res) => {
  const { taskId, userId } = req.params;
  
  try {
    await pool.execute('CALL RemoveUserFromTask(?, ?)', [taskId, userId]);
    res.status(200).json({ success: true, message: 'User removed from task' });
  } catch (error) {
    console.error('Error removing assignment:', error);
    res.status(500).json({ success: false, message: 'Failed to remove user from task' });
  }
};

// New method to get task assignment history
exports.getTaskAssignmentHistory = async (req, res) => {
  const { taskId } = req.params;
  
  try {
    const [rows] = await pool.execute('CALL GetTaskAssignmentHistory(?)', [taskId]);
    res.status(200).json({ success: true, data: rows[0] }); // First result set
  } catch (error) {
    console.error('Error fetching assignment history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch assignment history' });
  }
};
