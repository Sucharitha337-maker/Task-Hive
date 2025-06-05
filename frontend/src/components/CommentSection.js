import React, { useEffect, useState } from "react";
import "./styles/CommentSection.css";

export default function CommentSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:5000/api/comments/task/${taskId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const addComment = () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to comment");

    const userId = JSON.parse(atob(token.split('.')[1])).id;

    const payload = {
      task_id: taskId,
      user_id: userId,
      content: newComment,
    };

    fetch(`http://localhost:5000/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNewComment("");
          fetchComments();
        } else {
          throw new Error(data.message);
        }
      })
      .catch(err => {
        console.error("❌ Error adding comment:", err);
        alert("Failed to add comment");
      });
  };

  return (
    <div className="comment-section">
      <h2 className="comment-title">Comments</h2>

      {/* Input box comes first now */}
      <div className="comment-input-area">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={addComment}>Add Comment</button>
      </div>

      {/* Then the list of existing comments */}
      <div className="comment-list">
        {comments.map((comment, index) => {
          const initials = `${comment.first_name[0] || ""}${comment.last_name[0] || ""}`;
          const fullName = `${comment.first_name} ${comment.last_name}`;
          const timestamp = new Date(comment.timestamp).toLocaleString();

          return (
            <div key={index} className="comment-card">
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-name">{fullName}</span>
                  <span className="comment-time">{timestamp}</span>
                </div>
                <p className="comment-body">{comment.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
