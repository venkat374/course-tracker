import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setLoggedInUserId, setAuthToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("loggedInUserId", user.id);
      localStorage.setItem('username', user.username);
      localStorage.setItem("streak", user.streak);

      setAuthToken(token);
      setLoggedInUserId(user.id);

      if (typeof setstreak === "function") {
        setstreak(user.streak);
      }
  
      navigate("/");
    }
    catch (err) {
      console.error(
        "Login error:",
        err.response?.data?.message || err.message
      );
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h3>Login</h3>

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
            placeholder="Enter your username"
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
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
