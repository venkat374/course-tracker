// frontend/src/App.js
import React, { useState, useEffect } from 'react';
// Changed import for React Router v5
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

import './App.css'; 

// Import your components
import TrackedCourseList from "./components/TrackedCourseList";
import EditTrackedCourse from "./components/EditTrackedCourse";
import AddTrackedCourse from "./components/AddTrackedCourse";
// NEW: Import Login and Register components
import Login from "./components/Login";
import Register from "./components/Register";

// NEW: Setup Axios defaults for JWT
import axios from 'axios';
axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('authToken');
// Also ensure REACT_APP_BACKEND_URL is used in axios calls in other components

function App() {
  // NEW: State for authentication token and user ID
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Check localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('loggedInUserId');

    if (storedToken && storedUserId) {
      setAuthToken(storedToken);
      setLoggedInUserId(storedUserId);
      // Set axios default header immediately for subsequent requests
      axios.defaults.headers.common['x-auth-token'] = storedToken;
    }
  }, []);

  // NEW: Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    setAuthToken(null);
    setLoggedInUserId(null);
    delete axios.defaults.headers.common['x-auth-token']; // Remove token from axios headers
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <Link to="/" className="navbar-brand">Course Tracker</Link>
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">Courses</Link>
              </li>
              {/* Conditional rendering for navigation links */}
              {!authToken ? ( // If not logged in
                <>
                  <li className="navbar-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                </>
              ) : ( // If logged in
                <>
                  <li className="navbar-item">
                    <Link to="/add" className="nav-link">Add Course</Link>
                  </li>
                  <li className="navbar-item">
                    <a href="#" className="nav-link" onClick={handleLogout}>Logout ({loggedInUserId ? loggedInUserId.substring(0,6) + '...' : ''})</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
        <br />
        {/* NEW: Conditional routes based on authentication */}
        <Switch>
          <Route path="/" exact>
            {authToken ? (
              <TrackedCourseList loggedInUserId={loggedInUserId} authToken={authToken} />
            ) : (
              <Redirect to="/login" /> // Redirect unauthenticated users to login
            )}
          </Route>
          <Route path="/edit/:id">
            {authToken ? (
              <EditTrackedCourse loggedInUserId={loggedInUserId} authToken={authToken} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route path="/add">
            {authToken ? (
              <AddTrackedCourse loggedInUserId={loggedInUserId} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          {/* NEW: Login and Register Routes */}
          <Route path="/login">
            <Login setLoggedInUserId={setLoggedInUserId} setAuthToken={setAuthToken} />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          {/* Fallback for unknown routes */}
          <Route path="*">
            <h3 className="text-center">404 - Page Not Found</h3>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;