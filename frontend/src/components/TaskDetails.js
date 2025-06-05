import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentSection from "./CommentSection";
import FileUploader from "./FileUploader";
import AssignmentPanel from "./AssignmentPanel";
import "./styles/TaskDetails.css";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [assignmentHistory, setAssignmentHistory] = useState([]);

  const [form, setForm] = useState({
    status: "",
    priority: "",
    due_date: "",
    description: "",
    assigned_user_id: ""
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        setTask(data);
        setForm({
          status: data.status,
          priority: data.priority,
          due_date: data.due_date ? data.due_date.split("T")[0] : "",
          description: data.description || "",
          assigned_user_id: data.assigned_user_id || ""
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        setTask({ ...task, ...form });
        alert("✅ Task updated");
        setEditMode(false);
      } else {
        alert("❌ Update failed! Task might already be completed or an error occurred.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Error updating task");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Task deleted");
        navigate("/");
      } else {
        alert("❌ Failed to delete task");
      }
    } catch (err) {
      console.error("🔥 DELETE fetch error:", err);
    }
  };

  const handleUserAssign = async (selectedUserId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/task-assignments/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: id, userId: selectedUserId }),
      });
      const data = await response.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, assigned_user_id: selectedUserId }));
        alert("✅ User assigned successfully!");
      } else {
        alert("❌ Failed to assign user.");
      }
    } catch (error) {
      console.error("🔥 Assign error:", error);
      alert("❌ Error assigning user.");
    }
  };

  const handleUserUnassign = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/task-assignments/${id}/user/${form.assigned_user_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, assigned_user_id: "" }));
        alert("✅ User unassigned successfully!");
      } else {
        alert("❌ Failed to unassign user.");
      }
    } catch (error) {
      console.error("🔥 Unassign error:", error);
      alert("❌ Error unassigning user.");
    }
  };

  const fetchAssignmentHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/task-assignments/${id}/history`);
      const data = await res.json();
      if (data.success) {
        setAssignmentHistory(data.data);
        setShowHistoryPopup(true);
      } else {
        alert("❌ Failed to fetch assignment history");
      }
    } catch (err) {
      console.error("🔥 Error fetching history:", err);
      alert("❌ Server error fetching assignment history");
    }
  };

  if (!task) return <div className="task-details-container">Loading...</div>;

  return (
    <div className="task-details-container">
      <div className="task-header-wrapper">
        <h1>📝 {task.title}</h1>
        <div className="action-buttons">
          {editMode ? (
            <>
              <button className="edit-button" onClick={handleUpdate}> Save</button>
              <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
              <button
                className="delete-button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShowDeleteConfirm(true);
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <h2> Task Details </h2>
      <p><strong>Task ID:</strong> {task.id}</p>

      <div className="form-section">
        {editMode ? (
          <>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Assign To:</label>
              <AssignmentPanel
                taskId={id}
                initialAssignedUserId={form.assigned_user_id}
                onUserSelect={handleUserAssign}
              />
              {form.assigned_user_id && (
                <button
                  className="remove-button mt-2"
                  onClick={handleUserUnassign}
                >
                  ❌ Unassign
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Due Date:</strong> {task.due_date ? task.due_date.split("T")[0] : "N/A"}</p>
            <p><strong>Description:</strong> {task.description || "No description provided."}</p>

            {/* Updated Assigned To and History button */}
            <div className="assign-display">
              <div className="assign-text">
                <p><strong>Assigned To:</strong> {task.assigned_user_name || "Unassigned"}</p>
              </div>
              <div className="assign-actions">
                <button className="history-button" onClick={() => fetchAssignmentHistory()}>
                  Assignment History
                </button>
              </div>
            </div>

          </>
        )}
      </div>

      <div className="section-divider">
        <h2> Attachments</h2>
        <FileUploader taskId={id} />
      </div>

      <div className="section-divider">
        <CommentSection taskId={id} />
      </div>

      {showHistoryPopup && (
        <dialog className="history-popup" open>
          <h3>📜 Assignment History</h3>
          {assignmentHistory.length > 0 ? (
            <ul className="history-list">
              {assignmentHistory.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.first_name} {entry.last_name}</strong> — assigned on {new Date(entry.assigned_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignment history found.</p>
          )}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setShowHistoryPopup(false)}>Close</button>
          </div>
        </dialog>
      )}

      {showDeleteConfirm && (
        <dialog className="delete-modal" open>
          <h3>Are you sure you want to delete this task?</h3>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            <button className="btn-confirm-delete" onClick={handleDeleteConfirm}>Yes, Delete</button>
          </div>
        </dialog>
      )}
    </div>
  );
}
