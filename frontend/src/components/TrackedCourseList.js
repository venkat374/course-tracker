// frontend/src/components/TrackedCourseList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Component to display a single course row
// Component to display a single course row
const Course = props => (
    <tr>
        <td>{props.course.courseName}</td>
        <td>{props.course.status}</td>
        <td>{props.course.instructor}</td>
        <td>{props.course.completionDate ? new Date(props.course.completionDate).toLocaleDateString() : 'N/A'}</td>
        <td>{props.course.certificateLink ? <a href={props.course.certificateLink} target="_blank" rel="noopener noreferrer">Link</a> : 'N/A'}</td>
        <td>
            <div className="progress" style={{ width: '100px' }}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${props.course.progress}%` }}
                    aria-valuenow={props.course.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    {props.course.progress}%
                </div>
            </div>
        </td>
        <td>{props.course.notes}</td>
        <td>{new Date(props.course.createdAt).toLocaleDateString()}</td>
        <td>{new Date(props.course.updatedAt).toLocaleDateString()}</td>
        {/* MODIFIED: Wrapped buttons in a flex container for proper horizontal alignment and spacing */}
        <td>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Link to={"/edit/" + props.course._id} className="btn btn-sm btn-primary">Edit</Link>
                {/* Removed the "|" separator as buttons are now distinct */}
                {/* Removed ml-2, as gap handles spacing */}
                <a href="#" onClick={() => { props.deleteCourse(props.course._id) }} className="btn btn-sm btn-danger">Delete</a>
            </div>
        </td>
    </tr>
);

// Main component to list all tracked courses
function TrackedCourseList({ loggedInUserId, authToken }) {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loggedInUserId) {
            setError('User not logged in. Please log in to view courses.');
            return;
        }

        setError('');
        setMessage('Loading courses...');

        axios.get(`${process.env.REACT_APP_BACKEND_URL}/tracked-courses`)
            .then(response => {
                setCourses(response.data);
                setMessage('');
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
                setError(error.response?.data?.message || 'Failed to load courses.');
                setMessage('');
            });
    }, [loggedInUserId, authToken]);

    const deleteCourse = (id) => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tracked-courses/${id}`)
            .then(response => {
                setMessage(response.data.message);
                setCourses(courses.filter(el => el._id !== id));
            })
            .catch(error => {
                console.error("Error deleting course:", error);
                setError(error.response?.data?.message || 'Failed to delete course.');
            });
    };

    const courseList = () => {
        return courses.map(currentcourse => {
            return <Course course={currentcourse} deleteCourse={deleteCourse} key={currentcourse._id} />;
        });
    };

    return (
        <div>
            <h3>Tracked Courses</h3>
            {message && <div className="alert alert-info">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {/* ADD THIS DIV WITH THE overflow-x STYLE */}
            <div style={{ overflowX: 'auto' }}>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Course Name</th>
                            <th>Status</th>
                            <th>Instructor</th>
                            <th>Completion Date</th>
                            <th>Certificate Link</th>
                            <th>Progress (%)</th>
                            <th>Notes</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseList()}
                    </tbody>
                </table>
            </div>
            {/* END OF ADDED DIV */}
        </div>
    );
}

export default TrackedCourseList;