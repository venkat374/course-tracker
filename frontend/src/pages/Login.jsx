// frontend/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();   // 🚀 AuthContext login function

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        { username, password }
      );

      // Backend returns shape:
      // { token, user: { id, username, streak }, message }
      const { token, user } = res.data;

      // Save into AuthContext
      login({
        token,
        username: user.username,
        userId: user.id,
      });

      navigate("/"); // redirect to home
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Login failed. Try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Login</h2>

      {errorMsg && (
        <div className="alert alert-danger">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="form-group mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Login
        </button>

      </form>
    </div>
  );
};

export default Login;