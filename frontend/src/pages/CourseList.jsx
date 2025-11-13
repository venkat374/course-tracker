import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CourseRow = ({ course, deleteCourse }) => (
  <tr>
    <td>{course.courseName}</td>
    <td>{course.status}</td>
    <td>{course.instructor || "N/A"}</td>
    <td>
      {course.completionDate
        ? new Date(course.completionDate).toLocaleDateString()
        : "N/A"}
    </td>
    <td>
      {course.certificateLink ? (
        <a
          href={course.certificateLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      ) : (
        "N/A"
      )}
    </td>

    <td>
      <div className="progress" style={{ width: "100px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${course.progress}%` }}
        >
          {course.progress}%
        </div>
      </div>
    </td>

    <td>{course.notes || "—"}</td>
    <td>{new Date(course.createdAt).toLocaleDateString()}</td>
    <td>{new Date(course.updatedAt).toLocaleDateString()}</td>

    <td>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Link to={`/edit/${course._id}`} className="btn btn-sm btn-primary">
          Edit
        </Link>

        <button
          onClick={() => deleteCourse(course._id)}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

function CourseList({ loggedInUserId, authToken }) {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch courses
  useEffect(() => {
    if (!authToken) return;
    if (!loggedInUserId) return;

    setLoading(true);
    setError("");
    setMessage("");

    axios
      .get(`${backendUrl}/tracked-courses`, {
        headers: { "x-auth-token": authToken },
      })
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError(
          err.response?.data?.message || "Failed to load tracked courses."
        );
        setLoading(false);
      });
  }, [authToken, loggedInUserId]);

  // Delete a course
  const deleteCourse = (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;

    axios
      .delete(`${backendUrl}/tracked-courses/${id}`, {
        headers: { "x-auth-token": authToken },
      })
      .then((res) => {
        setMessage(res.data.message || "Course deleted successfully.");
        setCourses((prev) => prev.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting course:", err);
        setError(err.response?.data?.message || "Failed to delete course.");
      });
  };

  return (
    <div className="container mt-4">
      <h3>Your Courses</h3>

      {loading && <div className="alert alert-info">Loading courses...</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && courses.length === 0 && !error && (
        <div className="alert alert-warning mt-3">No courses found.</div>
      )}

      <div style={{ overflowX: "auto" }} className="mt-3">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Course Name</th>
              <th>Status</th>
              <th>Instructor</th>
              <th>Completion Date</th>
              <th>Certificate</th>
              <th>Progress</th>
              <th>Notes</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <CourseRow
                key={course._id}
                course={course}
                deleteCourse={deleteCourse}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseList;
