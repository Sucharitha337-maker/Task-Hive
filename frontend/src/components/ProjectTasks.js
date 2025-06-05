import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ExportButton from "./ExportButton";
import { jwtDecode } from "jwt-decode";
import "./styles/ProjectTasks.css";

export default function ProjectTasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ProjectID: "", Name: "", StartDate: "", EndDate: "", ProjectManagerID: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === "Admin");
      } catch (err) {
        console.error("Token decode error:", err.message);
      }
    }

    fetch(`http://localhost:5000/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProject(data.data);
          setForm({
            ProjectID: data.data.ProjectID,
            Name: data.data.Name,
            StartDate: data.data.StartDate?.split("T")[0],
            EndDate: data.data.EndDate?.split("T")[0],
            ProjectManagerID: data.data.ProjectManagerID || ""
          });
        }
      });

    fetch(`http://localhost:5000/api/tasks/project/${projectId}`)
      .then(res => res.json())
      .then(data => setTasks(data.data || []));

    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        }
      });
  }, [projectId]);

  const handleUpdate = async () => {
    const { Name, StartDate, EndDate, ProjectManagerID } = form;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Name, StartDate, EndDate, ProjectManagerID }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Project updated");
        setEditMode(false);
      } else {
        alert("❌ Update failed: " + result.message);
      }
    } catch (err) {
      alert("❌ Update failed: " + err.message);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Project deleted");
        window.location.href = "/";
      } else {
        alert("❌ Failed to delete: " + data.message);
      }
    } catch (err) {
      alert("❌ Delete failed: " + err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getManagerName = (id) => {
    const manager = users.find(u => u.id === id);
    return manager ? `${manager.first_name} ${manager.last_name}` : "Unknown";
  };

  return (
    <div className="project-details-container">
      <div className="project-header">
        <h1>📁 {editMode ? "Edit Project" : "Project Details"}</h1>
        {isAdmin && !editMode && (
          <div className="project-actions">
            <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>

      {editMode ? (
        <div className="project-form">
          <div className="form-group">
            <label>Project ID:</label>
            <input name="ProjectID" value={form.ProjectID} readOnly disabled />
          </div>
          <div className="form-group">
            <label>Project Name:</label>
            <input name="Name" value={form.Name} onChange={handleChange} placeholder="Project Name" />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input type="date" name="StartDate" value={form.StartDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="date" name="EndDate" value={form.EndDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Project Manager:</label>
            <select name="ProjectManagerID" value={form.ProjectManagerID} onChange={handleChange}>
              <option value="">-- Select Manager --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="project-actions">
            <button className="edit-button" onClick={handleUpdate}>Save Changes</button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p><strong>Project ID:</strong> {project?.ProjectID}</p>
          <p><strong>Name:</strong> {project?.Name}</p>
          <p><strong>Start Date:</strong> {project?.StartDate?.split("T")[0]}</p>
          <p><strong>End Date:</strong> {project?.EndDate?.split("T")[0]}</p>
          <p><strong>Project Manager:</strong> {getManagerName(project?.ProjectManagerID)}</p>
        </>
      )}

      <div className="export-section">
        <ExportButton data={tasks} />
      </div>

      <h2 className="task-subheading">Tasks</h2>
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks found for this project.</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className="task-card">
              <Link to={`/task/${task.id}`} className="task-link">
                <h3>{task.title}</h3>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Due Date:</strong> {task.due_date ? task.due_date.split("T")[0] : "N/A"}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
