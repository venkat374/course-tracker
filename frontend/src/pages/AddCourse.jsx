import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AddCourse() {
  const { userId, authToken } = useAuth();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [instructor, setInstructor] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [certificateLink, setCertificateLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [addError, setAddError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (e) => {
    e.preventDefault();
    setAddError("");
    setMessage("");

    if (!courseName.trim()) {
      setAddError("Course Name is required.");
      return;
    }

    if (progress < 0 || progress > 100) {
      setAddError("Progress must be between 0 and 100.");
      return;
    }

    const newCourse = {
      userId,
      courseName,
      status,
      instructor: instructor.trim() || null,
      completionDate: completionDate || null,
      certificateLink: certificateLink.trim() || null,
      progress: Number(progress),
      notes: notes.trim() || null,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/courses`,
        newCourse,
        { headers: { "x-auth-token": authToken } }
      );

      setMessage(response.data.message || "Course added!");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error("Error adding tracked course:", error);
      setAddError(
        error.response?.data?.message ||
          "Failed to add course. Please try again."
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add New Tracked Course</h3>

      {message && <div className="alert alert-info mt-3">{message}</div>}
      {addError && <div className="alert alert-danger mt-3">{addError}</div>}

      <form onSubmit={onSubmit} className="mt-4">

        <div className="form-group mb-3">
          <label>Course Name:</label>
          <input
            type="text"
            className="form-control"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Status:</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Planned">Planned</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <label>Instructor (Optional):</label>
          <input
            type="text"
            className="form-control"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Completion Date (Optional):</label>
          <input
            type="date"
            className="form-control"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Certificate Link (Optional):</label>
          <input
            type="text"
            className="form-control"
            value={certificateLink}
            onChange={(e) => setCertificateLink(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Progress (%):</label>
          <input
            type="number"
            className="form-control"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Notes (Optional):</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Course
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
