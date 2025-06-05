CREATE DATABASE task_management;
USE task_management;

-- USERS TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Member') NOT NULL
);

-- PROJECT TABLE WITH FK TO USERS
CREATE TABLE project (
  ProjectID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  StartDate DATE NOT NULL,
  EndDate DATE NOT NULL,
  ProjectManagerID INT,
  FOREIGN KEY (ProjectManagerID) REFERENCES users(id) ON DELETE SET NULL
);

-- TASKS TABLE WITH ENUMS
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Pending', 'In Progress', 'Completed') NOT NULL,
  priority ENUM('High', 'Medium', 'Low') NOT NULL,
  category VARCHAR(100),
  due_date DATE,
  assigned_user_id INT,
  project_id INT,
  created_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES project(ProjectID) ON DELETE SET NULL
);

-- COMMENTS TABLE WITH TIMESTAMP
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TASK ASSIGNMENTS WITH COMPOSITE PRIMARY KEY
CREATE TABLE task_assignments (
  task_id INT NOT NULL,
  assigned_user_id INT NOT NULL,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task_id, assigned_user_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PROCEDURES AND TRIGGERS
DELIMITER //

CREATE PROCEDURE AssignTaskToUser(IN taskId INT, IN userId INT, IN assignedDate DATE)
BEGIN
  INSERT INTO task_assignments (task_id, assigned_user_id, assigned_date)
  VALUES (taskId, userId, assignedDate);
END //

CREATE PROCEDURE UpdateTaskPriority(IN taskId INT, IN newPriority VARCHAR(10))
BEGIN
  UPDATE tasks SET priority = newPriority WHERE id = taskId;
END //

CREATE PROCEDURE GetTaskAssignmentHistory(IN taskId INT)
BEGIN
  SELECT ta.task_id, ta.assigned_user_id, u.first_name, u.last_name, ta.assigned_date
  FROM task_assignments ta
  INNER JOIN users u ON ta.assigned_user_id = u.id
  WHERE ta.task_id = taskId;
END //

CREATE PROCEDURE GetTasksByProject(IN projectId INT)
BEGIN
  SELECT t.id, t.title, t.status, t.priority, t.due_date
  FROM tasks t
  WHERE t.project_id = projectId
  ORDER BY t.due_date ASC;
END //

CREATE PROCEDURE GetCommentsByUser(IN userId INT)
BEGIN
  SELECT c.id, c.content, c.timestamp, t.title AS task_title
  FROM comments c
  INNER JOIN tasks t ON c.task_id = t.id
  WHERE c.user_id = userId;
END //

DROP PROCEDURE IF EXISTS RemoveUserFromTask;
DELIMITER //

CREATE PROCEDURE RemoveUserFromTask(IN taskId INT, IN userId INT)
BEGIN
  UPDATE tasks SET assigned_user_id = NULL
  WHERE id = taskId AND assigned_user_id = userId;

  DELETE FROM task_assignments
  WHERE task_id = taskId AND assigned_user_id = userId;
END //

DELIMITER ;

CREATE PROCEDURE GetTasksByPriority(IN priorityVal VARCHAR(10))
BEGIN
  SELECT * FROM tasks WHERE priority = priorityVal ORDER BY due_date ASC;
END //

CREATE PROCEDURE GetTasksByStatus(IN statusVal VARCHAR(20))
BEGIN
  SELECT * FROM tasks WHERE status = statusVal ORDER BY due_date ASC;
END //

DELIMITER ;

-- VIEW
CREATE OR REPLACE VIEW ProjectTasksOverview AS 
SELECT p.Name AS project_name, t.id, t.title, t.status, t.priority, t.due_date 
FROM project p 
INNER JOIN tasks t ON p.ProjectID = t.project_id;

-- TRIGGERS
DELIMITER //
CREATE TRIGGER ValidateTaskBeforeInsert 
BEFORE INSERT ON tasks
FOR EACH ROW 
BEGIN
  IF NEW.due_date IS NULL OR NEW.priority NOT IN ('High', 'Medium', 'Low') THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Invalid due date or priority for the task.';
  END IF;
END //

CREATE TRIGGER PreventCompletedTaskUpdate 
BEFORE UPDATE ON tasks
FOR EACH ROW 
BEGIN
  IF OLD.status = 'Completed' THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Updates are not allowed for completed tasks.';
  END IF;
END //

CREATE TRIGGER CascadeDeleteOnProject 
BEFORE DELETE ON project 
FOR EACH ROW 
BEGIN
  DELETE FROM tasks WHERE project_id = OLD.ProjectID;
END //
DELIMITER ;