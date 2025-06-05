const pool = require('../config/db');

exports.addComment = async (req, res) => {
  const { task_id, user_id, content } = req.body;

  if (!task_id || !user_id || !content) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    await pool.query(
      `INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)`,
      [task_id, user_id, content]
    );
    res.status(201).json({ success: true, message: "Comment added" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};


exports.getCommentsByTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.first_name, u.last_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.task_id = ?
      ORDER BY c.timestamp DESC
    `, [taskId]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching task comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

exports.getCommentsByUser = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate, taskId, projectId } = req.query;

  let query = `
    SELECT c.*, t.project_id
    FROM comments c
    JOIN tasks t ON c.task_id = t.id
    WHERE c.user_id = ?
  `;
  const params = [userId];

  if (startDate) {
    query += ` AND c.timestamp >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    query += ` AND c.timestamp <= ?`;
    params.push(endDate);
  }

  if (taskId) {
    query += ` AND c.task_id = ?`;
    params.push(taskId);
  }

  if (projectId) {
    query += ` AND t.project_id = ?`;
    params.push(projectId);
  }

  query += ` ORDER BY c.timestamp DESC`;

  try {
    const [rows] = await pool.query(query, params);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching user comments:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user comments" });
  }
};
