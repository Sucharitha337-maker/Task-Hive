import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "./Layout";
import "./styles/UserComments.css";

export default function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    projectId: "",
    taskId: ""
  });

  useEffect(() => {
    fetchComments();
  }, [userId]);

  const fetchComments = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:5000/api/comments/user/${userId}?${query}`);
      const data = await res.json();
      if (data.success) setComments(data.data || []);
      else setComments([]);
    } catch (err) {
      console.error("❌ Error fetching user comments:", err);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchComments();
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="user-comments-container">
        <h1 className="comments-title">User Comments</h1>

        <form onSubmit={handleFilter} className="filter-form">
          <div className="filter-field">
            <label>Start Date</label>
              <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
          </div>
          <div className="filter-field">
            <label>End Date</label>
              <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
          </div>
          <div className="filter-field">
            <label>Project ID</label>
              <input type="text" name="projectId" value={filters.projectId} onChange={handleChange} placeholder="Project ID" />
          </div>
          <div className="filter-field">
            <label>Task ID</label>
              <input type="text" name="taskId" value={filters.taskId} onChange={handleChange} placeholder="Task ID" />
          </div>  
          <div className="filter-field">  
          <button type="submit">Search</button>
          </div> 
        </form>

        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-box">
              <div className="comment-header">
                <Link to={`/task/${c.task_id}`} className="task-link">
                  Task #{c.task_id}
                </Link>
              </div>
              <div className="comment-body">{c.content}</div>
              <div className="comment-timestamp">
                {new Date(c.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
