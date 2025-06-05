import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

export default function Login({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Member",
    password: "",
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const endpoint = isLogin ? "login" : "register";

    try {
      const res = await fetch(`http://localhost:5000/api/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          setIsAuthenticated(true);
          navigate("/");
        } else {
          alert("Registration successful. Please login.");
          setIsLogin(true);
        }
      } else {
        setErr(data.error || `${isLogin ? "Login" : "Registration"} failed`);
      }
    } catch (err) {
      setErr("Server error");
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login to Task Manager" : "Register for Task Manager"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {err && <p className="error">{err}</p>}
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
}
