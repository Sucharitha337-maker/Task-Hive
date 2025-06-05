import React, { useEffect, useState, useRef } from "react";
import "./styles/AssignmentPanel.css";

export default function AssignmentPanel({ taskId, initialAssignedUserId = "", onUserSelect = null }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(initialAssignedUserId);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => {
        const userList = Array.isArray(data) ? data : data.data || [];
        setUsers(userList);

        if (initialAssignedUserId) {
          const user = userList.find(u => u.id === Number(initialAssignedUserId));
          if (user) {
            setSearch(`${user.first_name} ${user.last_name}`);
          }
        }
      });
  }, [initialAssignedUserId]);

  useEffect(() => {
    if (search.trim()) {
      const lower = search.toLowerCase();
      const filtered = users.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(lower)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, users]);

  const handleSelect = (userId, fullName) => {
    setSelectedUser(userId);
    setSearch(fullName);
    setShowSuggestions(false);
    if (onUserSelect) {
      onUserSelect(userId); // parent component will handle assignment if provided
    }
  };

  const assignUser = () => {
    if (!selectedUser) return alert("Please select a user to assign");

    fetch("http://localhost:5000/api/task-assignments/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, userId: selectedUser }),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.success ? "✅ User assigned successfully" : "❌ Failed to assign user");
      })
      .catch(err => {
        console.error("Error assigning user:", err);
        alert("❌ Server error");
      });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="assignment-panel" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-1 rounded"
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map(user => {
            const fullName = `${user.first_name} ${user.last_name}`;
            return (
              <li key={user.id} onClick={() => handleSelect(user.id, fullName)}>
                {fullName}
              </li>
            );
          })}
        </ul>
      )}
      {/* Only show assign button if parent didn't pass onUserSelect */}
      {!onUserSelect && taskId && (
        <button
          onClick={assignUser}
          className="ml-2 bg-purple-600 text-white px-4 py-1 rounded"
        >
          Assign
        </button>
      )}
    </div>
  );
}
