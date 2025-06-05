import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import "./styles/Dashboard.css";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log("Decoded token userId:", decoded.id);
        setUserId(decoded.id);
      } catch (error) {
        console.error("🔥 Error decoding token", error);
      }
    } else {
      console.error("No token found.");
    }
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetch(`http://localhost:5000/api/tasks/assigned/${userId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Fetched tasks data:", data);
          if (data.success) {
            setTasks(data.data);
          } else {
            console.error("Failed to fetch tasks:", data.message);
          }
        })
        .catch(err => console.error("🔥 Error fetching my tasks:", err));
    }
  }, [userId]); // 👈 Second useEffect dependent on userId

  return (
    <Layout>
      <div className="dashboard-header">
        <h1>🧑‍💻 My Tasks</h1>
      </div>

      <div className="task-grid">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <Link key={task.id} to={`/task/${task.id}`} className="task-card">
              <h2>{task.title}</h2>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Due:</strong> {task.due_date ? task.due_date.split('T')[0] : "N/A"}</p>
              <p><strong>Assigned:</strong> {task.assigned_user_name || "Unassigned"}</p>
            </Link>
          ))
        ) : (
          <p style={{ fontSize: "16px", textAlign: "center", marginTop: "30px" }}>
            No tasks assigned to you yet.
          </p>
        )}
      </div>
    </Layout>
  );
}
