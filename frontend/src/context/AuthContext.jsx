// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("loggedInUserId");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUserId && storedUsername) {
      setAuthToken(storedToken);
      setUserId(storedUserId);
      setUsername(storedUsername);

      axios.defaults.headers.common["x-auth-token"] = storedToken;
    }

    setLoading(false);
  }, []);

  // Keep axios header in sync
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["x-auth-token"] = authToken;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  }, [authToken]);

  const login = ({ token, userId, username }) => {
    setAuthToken(token);
    setUserId(userId);
    setUsername(username);

    localStorage.setItem("authToken", token);
    localStorage.setItem("loggedInUserId", userId);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    setUsername(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("username");
  };

  const value = {
    authToken,
    userId,
    username,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
