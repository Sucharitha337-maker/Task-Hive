import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Layout.css";

export default function Layout({ children }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.id);
      } catch (err) {
        console.error("Error decoding token", err);
      }
    }
  }, []);

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="logo">TaskManager</div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/create-task">Add Task</Link>
          <Link to="/projects">Projects</Link>
          <Link to={`/my-tasks`}>My Tasks</Link>
          {userId && <Link to={`/user/${userId}/comments`}>My Comments</Link>}
        </div>
      </nav>

      <div className="page-content">{children}</div>
    </div>
  );
}
