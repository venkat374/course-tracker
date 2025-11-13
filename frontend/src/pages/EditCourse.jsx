import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditCourse({ loggedInUserId }) {
  const [courseName, setCourseName] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [instructor, setInstructor] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [certificateLink, setCertificateLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [editError, setEditError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUserId) {
      setEditError("User not logged in. Please log in to edit courses.");
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    axios
      .get(`${backendUrl}/tracked-courses/${id}`)
      .then((response) => {
        const course = response.data;
        setCourseName(course.courseName || "");
        setStatus(course.status || "Ongoing");
        setInstructor(course.instructor || "");
        setCompletionDate(
          course.completionDate
            ? new Date(course.completionDate).toISOString().split("T")[0]
            : ""
        );
        setCertificateLink(course.certificateLink || "");
        setProgress(course.progress || 0);
        setNotes(course.notes || "");
      })
      .catch((error) => {
        console.error("Error fetching course for edit:", error);
        setEditError(
          error.response?.data?.message ||
            "Failed to load course details for editing."
        );
      });
  }, [id, loggedInUserId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setEditError("");

    // Client-side Validation
    if (!courseName.trim()) {
      setEditError("Course Name is required.");
      return;
    }
    if (progress < 0 || progress > 100) {
      setEditError("Progress must be between 0 and 100.");
      return;
    }

    const updatedCourse = {
      courseName,
      status,
      instructor: instructor.trim() || null,
      completionDate: completionDate || null,
      certificateLink: certificateLink.trim() || null,
      progress: Number(progress),
      notes: notes.trim() || null,
    };

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.patch(
        `${backendUrl}/tracked-courses/${id}`,
        updatedCourse
      );

      setMessage(response.data.message || "Course updated successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error updating course:", error);
      setEditError(
        error.response?.data?.message ||
          "Failed to update course. Please try again."
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>Edit Tracked Course</h3>

      {message && <div className="alert alert-info mt-3">{message}</div>}
      {editError && <div className="alert alert-danger mt-3">{editError}</div>}

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
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCourse;
