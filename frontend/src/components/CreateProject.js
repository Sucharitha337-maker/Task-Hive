import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./styles/TaskForm.css";
import { jwtDecode } from "jwt-decode";

export default function CreateProject() {
  const [form, setForm] = useState({ name: "", start: "", end: "", managerId: "" });
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all users
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("❌ You must be logged in as an Admin to create a project.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "Admin") {
        setError("❌ Only Admins can create projects.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ProjectID: Math.floor(Math.random() * 10000),
          Name: form.name,
          StartDate: form.start,
          EndDate: form.end,
          ProjectManagerID: form.managerId || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Project created");
        navigate("/projects");
      } else {
        setError(data.message || "❌ Failed to create project.");
      }
    } catch (err) {
      console.error("Token or request error:", err);
      setError("❌ Invalid token or server error.");
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              name="name"
              placeholder="Project Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="start"
              value={form.start}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="end"
              value={form.end}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Project Manager</label>
            <select
              name="managerId"
              value={form.managerId}
              onChange={handleChange}
              required
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Create Project</button>
        </form>
      </div>
    </Layout>
  );
}
