import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddCourse({ loggedInUserId }) {
  const [courseName, setCourseName] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [instructor, setInstructor] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [certificateLink, setCertificateLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [addError, setAddError] = useState("");
  const navigate = useNavigate();

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

    const newTrackedCourse = {
      userId: loggedInUserId,
      courseName,
      status,
      instructor: instructor.trim() || null,
      completionDate: completionDate || null,
      certificateLink: certificateLink.trim() || null,
      progress: parseInt(progress, 10),
      notes: notes.trim() || null,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/courses/`,
        newTrackedCourse
      );
      setMessage(response.data.message);

      setCourseName("");
      setStatus("Ongoing");
      setInstructor("");
      setCompletionDate("");
      setCertificateLink("");
      setProgress(0);
      setNotes("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
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
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            className="form-control"
            required
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
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
          <label htmlFor="instructor">Instructor (Optional):</label>
          <input
            type="text"
            id="instructor"
            className="form-control"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="completionDate">Completion Date (Optional):</label>
          <input
            type="date"
            id="completionDate"
            className="form-control"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="certificateLink">Certificate Link (Optional):</label>
          <input
            type="text"
            id="certificateLink"
            className="form-control"
            value={certificateLink}
            onChange={(e) => setCertificateLink(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="progress">Progress (%):</label>
          <input
            type="number"
            id="progress"
            className="form-control"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            min="0"
            max="100"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="notes">Notes (Optional):</label>
          <textarea
            id="notes"
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;
