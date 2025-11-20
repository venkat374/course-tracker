import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditCourse() {
  const { userId, authToken } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [instructor, setInstructor] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [certificateLink, setCertificateLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");
  const [editError, setEditError] = useState("");
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch course details
  useEffect(() => {
    if (!authToken) return;

    axios
      .get(`${backendUrl}/courses/${id}`, {
        headers: { "x-auth-token": authToken },
      })
      .then((res) => {
        const course = res.data;

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

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching course for edit:", err);
        setEditError(err.response?.data?.message || "Failed to load course.");
        setLoading(false);
      });
  }, [id, authToken]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setEditError("");

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
      const res = await axios.patch(
        `${backendUrl}/courses/${id}`,
        updatedCourse,
        { headers: { "x-auth-token": authToken } }
      );

      setMessage(res.data.message || "Course updated successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error("Error updating course:", err);
      setEditError(
        err.response?.data?.message || "Failed to update course. Please try again."
      );
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading course...</div>;
  }

  return (
    <div className="container mt-4">
      <h3>Edit Tracked Course</h3>

      {message && <div className="alert alert-info mt-3">{message}</div>}
      {editError && <div className="alert alert-danger mt-3">{editError}</div>}

      <form onSubmit={onSubmit} className="mt-4">
        <div className="form-group mb-3">
          <label>Course Name</label>
          <input
            type="text"
            className="form-control"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Status</label>
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
          <label>Instructor (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Completion Date (Optional)</label>
          <input
            type="date"
            className="form-control"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Certificate Link (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={certificateLink}
            onChange={(e) => setCertificateLink(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Progress (%)</label>
          <input
            type="number"
            className="form-control"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            min="0"
            max="100"
          />
        </div>

        <div className="form-group mb-3">
          <label>Notes (Optional)</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Course
        </button>
      </form>
    </div>
  );
}

export default EditCourse;
