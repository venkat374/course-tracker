import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseList from "./pages/CourseList";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import Pomodoro from "./pages/Pomodoro";

function App() {
  const { authToken, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditCourse />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <Pomodoro />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<h3 className="text-center">404 - Page Not Found</h3>}
        />
        
      </Routes>
    </div>
  );
}

export default App;
