import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./styles/ProjectList.css";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
      });
  }, []);

  const handleProjectSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/project/${searchId}/tasks`);
  };

  return (
    <Layout>
      <div className="project-list-container">
        <div className="project-list-header">
          <h2>📁 All Projects</h2>
          <div className="header-actions">
            <button className="create-project-btn" onClick={() => navigate("/create-project")}>
              Create
            </button>
          </div>
        </div>

        {/* 🔍 Search by Project ID */}
        <form className="project-search-bar" onSubmit={handleProjectSearch}>
          <input
            type="text"
            placeholder="Enter Project ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="project-grid">
          {projects.map((project) => (
            <Link
              to={`/project/${project.ProjectID}/tasks`}
              className="project-card"
              key={project.ProjectID}
            >
              <h3>{project.Name}</h3>
              <p><strong>Project ID:</strong> {project.ProjectID}</p>
              <p><strong>Start Date:</strong> {project.StartDate?.split("T")[0]}</p>
              <p><strong>End Date:</strong> {project.EndDate?.split("T")[0]}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
