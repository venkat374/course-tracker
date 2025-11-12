import { Routes, Route, Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import TrackedCourseList from "./components/TrackedCourseList.jsx";
import EditTrackedCourse from "./components/EditTrackedCourse.jsx";
import AddTrackedCourse from "./components/AddTrackedCourse.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("loggedInUserId");

    if (storedToken && storedUserId) {
      setAuthToken(storedToken);
      setLoggedInUserId(storedUserId);
      axios.defaults.headers.common["x-auth-token"] = storedToken;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUserId");
    setAuthToken(null);
    setLoggedInUserId(null);
    delete axios.defaults.headers.common["x-auth-token"];
  };

  return (
    <div className="container">
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          Course Tracker
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">
                Courses
              </Link>
            </li>
            {!authToken ? (
              <>
                <li className="navbar-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="navbar-item">
                  <Link to="/add" className="nav-link">
                    Add Course
                  </Link>
                </li>
                <li className="navbar-item">
                  <a href="#" className="nav-link" onClick={handleLogout}>
                    Logout (
                    {loggedInUserId
                      ? loggedInUserId.substring(0, 6) + "..."
                      : ""}
                    )
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <br />

      <Routes>
        <Route
          path="/"
          element={
            authToken ? (
              <TrackedCourseList
                loggedInUserId={loggedInUserId}
                authToken={authToken}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit/:id"
          element={
            authToken ? (
              <EditTrackedCourse
                loggedInUserId={loggedInUserId}
                authToken={authToken}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add"
          element={
            authToken ? (
              <AddTrackedCourse loggedInUserId={loggedInUserId} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setLoggedInUserId={setLoggedInUserId}
              setAuthToken={setAuthToken}
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
