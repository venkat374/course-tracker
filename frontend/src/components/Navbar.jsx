// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { authToken, username, logout } = useAuth();

  const [streakCount, setStreakCount] = useState(() => {
    const stored = localStorage.getItem("streakCount");
    if (stored === null) return 0;
    const n = Number(stored);
    return Number.isNaN(n) ? 0 : n;
  });

  const [loadingStreak, setLoadingStreak] = useState(false);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!authToken) {
        setStreakCount(0);
        return;
      }

      try {
        setLoadingStreak(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/streak`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const streakFromServer = Number(res.data?.streak ?? 0);
        setStreakCount(streakFromServer);
        localStorage.setItem("streakCount", String(streakFromServer));
      } catch (err) {
        console.error("Failed to fetch streak:", err.response?.data || err);
      } finally {
        setLoadingStreak(false);
      }
    };

    fetchStreak();
  }, [authToken]);

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

          <li className="navbar-item">
            <Link to="/pomodoro" className="nav-link">
              Pomodoro
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
              <li className="navbar-item d-flex align-items-center mx-2">
                <span
                  role="img"
                  aria-label="streak"
                  style={{ fontSize: "1.2rem", marginRight: "4px" }}
                >
                  🔥
                </span>
                <span className="text-warning">
                  {loadingStreak ? "…" : streakCount}
                </span>
              </li>

              <li className="navbar-item">
                <Link to="/add" className="nav-link">
                  Add Course
                </Link>
              </li>

              <li className="navbar-item">
                <button
                  type="button"
                  className="nav-link btn btn-link p-0"
                  onClick={logout}
                  style={{ textDecoration: "none" }}
                >
                  Logout {username ? `(${username})` : ""}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
