import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TaskDetails from "./components/TaskDetails";
import UserComments from "./components/UserComments";
import ProjectTasks from "./components/ProjectTasks";
import TaskForm from "./components/TaskForm";
import TasksByPriority from "./components/TasksByPriority";
import TasksByStatus from "./components/TasksByStatus";
import Login from "./components/Login";
import ProjectList from "./components/ProjectList";
import CreateProject from "./components/CreateProject";
import MyTasks from "./components/Mytasks";
import "./index.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/task/:id" element={isAuthenticated ? <TaskDetails /> : <Navigate to="/login" />} />
        <Route path="/tasks/priority" element={isAuthenticated ? <TasksByPriority /> : <Navigate to="/login" />} />
        <Route path="/tasks/status" element={isAuthenticated ? <TasksByStatus /> : <Navigate to="/login" />} />
        <Route path="/user/:userId/comments" element={isAuthenticated ? <UserComments /> : <Navigate to="/login" />} />
        <Route path="/project/:projectId/tasks" element={isAuthenticated ? <ProjectTasks /> : <Navigate to="/login" />} />
        <Route path="/create-task" element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} />
        <Route path="/create-project" element={isAuthenticated ? <CreateProject /> : <Navigate to="/login" />} />
        <Route path="/projects" element={isAuthenticated ? <ProjectList /> : <Navigate to="/login" />} />

        {/* ✅ NEW ROUTE */}
        <Route path="/my-tasks" element={isAuthenticated ? <MyTasks /> : <Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}
