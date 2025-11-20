import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(`${backendUrl}/auth/register`, {
        username,
        password,
      });

      setMessage(res.data.message || "Registration successful!");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h3>Register User</h3>

      {message && <div className="alert alert-info mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <form onSubmit={onSubmit} className="mt-4">
        <div className="form-group mb-3">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
        </div>

        <div className="form-group mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
