const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const commentRoutes = require('./routes/comment.routes');
const taskAssignmentRoutes = require('./routes/taskAssignment.routes');
const projectRoutes = require('./routes/project.routes'); // Add project routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes - Update with specific paths instead of all at /api
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/task-assignments', taskAssignmentRoutes);
app.use('/api/projects', projectRoutes); // Mount project routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
