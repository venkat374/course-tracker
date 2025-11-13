import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ authToken, username, handleLogout }) => {
    return (
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
                    {username ? `${username}` : ""}
                    )
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    )
}

export default Navbar;