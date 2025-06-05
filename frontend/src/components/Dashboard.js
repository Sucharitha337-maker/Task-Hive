import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./styles/Dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);
    }

    fetch("http://localhost:5000/api/tasks")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!searchId.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${searchId}`);
      if (res.ok) {
        navigate(`/task/${searchId}`);
      } else if (res.status === 404) {
        setErrorMsg(`Task with ID ${searchId} not found.`);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Error connecting to the server.");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const priorityMatch = priorityFilter ? task.priority === priorityFilter : true;
    const statusMatch = statusFilter ? task.status === statusFilter : true;
    return priorityMatch && statusMatch;
  });

  return (
    <Layout>
      <div className="dashboard-header">
        <h1>🗂️ Task Dashboard</h1>
      </div>

      <form className="task-search-bar" onSubmit={handleSearch}>
        <input
          type="number"
          placeholder="🔍 Enter Task ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="task-search-input"
        />
        <button type="submit" className="task-search-icon-btn" title="Search">
          Search
        </button>
      </form>

      {errorMsg && <p className="error-message">{errorMsg}</p>}

      <div className="filter-section">
        <div className="chip-group">
          <span className="chip-label">Priority:</span>
          {["High", "Medium", "Low"].map(priority => (
            <button
              key={priority}
              className={`chip ${priorityFilter === priority ? "chip-active" : ""}`}
              onClick={() => setPriorityFilter(priority)}
            >
              {priority}
            </button>
          ))}
          {priorityFilter && (
            <button className="clear-filter-btn" onClick={() => setPriorityFilter(null)}>
              ✖ Clear
            </button>
          )}
        </div>

        <div className="chip-group">
          <span className="chip-label">Status:</span>
          {["Pending", "In Progress", "Completed"].map(status => (
            <button
              key={status}
              className={`chip ${statusFilter === status ? "chip-active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
          {statusFilter && (
            <button className="clear-filter-btn" onClick={() => setStatusFilter(null)}>
              ✖ Clear
            </button>
          )}
        </div>
      </div>

      <div className="task-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
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
            No tasks match the selected filters.
          </p>
        )}
      </div>
    </Layout>
  );
}
