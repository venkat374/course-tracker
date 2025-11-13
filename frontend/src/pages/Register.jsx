import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          username,
          password,
        }
      );

      setMessage(response.data.message || "Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(
        "Registration error:",
        err.response?.data?.message || err.message
      );
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
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
