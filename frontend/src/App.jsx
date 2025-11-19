import { Routes, Route, Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "../components/Navbar.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import CourseList from "./pages/CourseList.jsx";
import EditCourse from "./pages/EditCourse.jsx";
import AddCourse from "./pages/AddCourse.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Always run ONCE at import time
const initialToken = localStorage.getItem("authToken");
if (initialToken) {
  axios.defaults.headers.common["x-auth-token"] = initialToken;
}

function App() {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setstreak] = useState(Number(localStorage.getItem("streak")) || 92);

  // Load stored credentials
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("loggedInUserId");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUserId && storedUsername) {
      setAuthToken(storedToken);
      setLoggedInUserId(storedUserId);
      setUsername(storedUsername);
      axios.defaults.headers.common["x-auth-token"] = storedToken;
    }

    setLoading(false);
  }, []);

  // Keep Axios token updated whenever authToken changes
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["x-auth-token"] = authToken;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  }, [authToken]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("username");

    setAuthToken(null);
    setLoggedInUserId(null);
    setUsername(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar
        authToken={authToken}
        username={username}
        handleLogout={handleLogout}
        streak={streak}
      />

      <br />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute authToken={authToken}>
              <CourseList 
                loggedInUserId={loggedInUserId}
                authToken={authToken} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute authToken={authToken}>
              <AddCourse
                loggedInUserId={loggedInUserId}
                authToken={authToken} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute authToken={authToken}>
              <EditCourse loggedInUserId={loggedInUserId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <Login
              setLoggedInUserId={setLoggedInUserId}
              setAuthToken={setAuthToken}
              setUsername={setUsername}
              setstreak={setstreak}
            />
          }
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="*"
          element={<h3 className="text-center">404 - Page Not Found</h3>}
        />
      </Routes>
    </div>
  );
}

export default App;
