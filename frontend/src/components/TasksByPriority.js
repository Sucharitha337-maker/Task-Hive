import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from "./Layout";
import "./styles/Dashboard.css";

export default function TasksByPriority() {
  const location = useLocation();
  const priority = location.state?.level;
  const [tasks, setTasks] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!priority) return;

    fetch(`http://localhost:5000/api/tasks/by-priority/${priority}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(data.data);
        } else {
          setErrorMsg("Failed to load tasks by priority.");
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setErrorMsg("Error fetching tasks.");
      });
  }, [priority]);

  return (
    <Layout>
      <div className="dashboard-header">
        <h2>Tasks Grouped by Priority: {priority}</h2>
      </div>

      {errorMsg && <p className="error-message">{errorMsg}</p>}

      <div className="task-grid">
        {tasks.map(task => (
          <Link key={task.id} to={`/task/${task.id}`} className="task-card">
            <h2>{task.title}</h2>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Due:</strong> {task.due_date || "N/A"}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
