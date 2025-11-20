import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
  );
  const [username, setUsername] = useState(() =>
    localStorage.getItem("username")
  );
  const [userId, setUserId] = useState(() =>
    localStorage.getItem("loggedInUserId")
  );
  const [streak, setStreak] = useState(() =>
    Number(localStorage.getItem("streakCount")) || 0
  );

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (authToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/auth/streak`
          );

          setStreak(res.data.streak);
          localStorage.setItem("streakCount", res.data.streak);
        } catch (err) {
          console.error("Streak load failed:", err);
        }
      }

      setAuthLoading(false);
    };

    init();
  }, [authToken]);

  const login = (token, user) => {
    setAuthToken(token);
    setUsername(user.username);
    setUserId(user.id);
    setStreak(user.streak);

    localStorage.setItem("authToken", token);
    localStorage.setItem("username", user.username);
    localStorage.setItem("loggedInUserId", user.id);
    localStorage.setItem("streakCount", user.streak);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setAuthToken(null);
    setUsername(null);
    setUserId(null);
    setStreak(0);

    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        username,
        userId,
        streak,
        isAuthenticated: Boolean(authToken),
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
