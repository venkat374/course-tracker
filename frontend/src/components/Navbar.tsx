import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX, FiLogOut, FiActivity } from "react-icons/fi";

const Navbar: React.FC = () => {
  const { authToken, username, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [streak, setStreak] = useState<number>(0);
  const [loadingStreak, setLoadingStreak] = useState(false);

  const backend = import.meta.env.VITE_BACKEND_URL;

  // Fetch streak only if logged in
  useEffect(() => {
    if (!authToken) {
      setStreak(0);
      return;
    }

    const fetchStreak = async () => {
      try {
        setLoadingStreak(true);

        const res = await axios.get(`${backend}/auth/streak`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const s = Number(res.data?.streak ?? 0);
        setStreak(s);
        localStorage.setItem("streakCount", String(s));
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      } finally {
        setLoadingStreak(false);
      }
    };

    fetchStreak();
  }, [authToken, backend]);

  // Show login-only navbar on login/register pages
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const navLinks = [
    { name: "Courses", path: "/" },
    { name: "Pomodoro", path: "/pomodoro" },
    { name: "Add Course", path: "/add" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="font-heading font-bold text-xl text-slate-800">
                Course Tracker
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {authToken && !isAuthPage && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors duration-200 ${location.pathname === link.path
                        ? "text-primary-600"
                        : "text-slate-600 hover:text-primary-600"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-100">
                  <span>🔥</span>
                  <span>{loadingStreak ? "..." : streak}</span>
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <span className="text-sm text-slate-600 font-medium">
                    {username}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                    title="Logout"
                  >
                    <FiLogOut size={20} />
                  </button>
                </div>
              </>
            )}

            {!authToken && (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-primary-600 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-primary-600 hover:bg-slate-50 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {authToken && !isAuthPage ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path
                        ? "bg-primary-50 text-primary-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-600 font-medium">
                    <span>🔥</span>
                    <span>{loadingStreak ? "..." : streak} Streak</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-500 font-medium"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
