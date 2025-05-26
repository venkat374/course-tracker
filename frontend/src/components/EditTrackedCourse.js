// frontend/src/components/EditTrackedCourse.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

function EditTrackedCourse({ loggedInUserId }) { // loggedInUserId is needed for backend update check
    const [courseName, setCourseName] = useState('');
    const [status, setStatus] = useState('');
    const [instructor, setInstructor] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [certificateLink, setCertificateLink] = useState('');
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [editError, setEditError] = useState('');

    const { id } = useParams(); // Get ID from URL parameters
    const history = useHistory();

    useEffect(() => {
        if (!loggedInUserId) {
            setEditError('User not logged in. Please log in to edit courses.');
            return;
        }

        // REMOVED: ?userId=${loggedInUserId} from the URL
        // Backend's isAuthenticated middleware verifies ownership via JWT
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/tracked-courses/${id}`)
            .then(response => {
                const course = response.data;
                setCourseName(course.courseName);
                setStatus(course.status);
                setInstructor(course.instructor || '');
                // Format date for input type="date"
                setCompletionDate(course.completionDate ? new Date(course.completionDate).toISOString().split('T')[0] : '');
                setCertificateLink(course.certificateLink || '');
                setProgress(course.progress);
                setNotes(course.notes || '');
            })
            .catch(function (error) {
                console.error("Error fetching course for edit:", error);
                setEditError(error.response?.data?.message || 'Failed to load course details for editing.');
            });
    }, [id, loggedInUserId]); // Re-run effect if ID or loggedInUserId changes

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setEditError('');

        // Client-side Validation
        if (!courseName.trim()) {
            setEditError('Course Name is required.');
            return;
        }
        if (progress < 0 || progress > 100) {
            setEditError('Progress must be between 0 and 100.');
            return;
        }

        const updatedCourse = {
            // userId: loggedInUserId, // Not strictly needed in body for update, backend already filters by token's userId
            courseName,
            status,
            instructor: instructor.trim() || null,
            completionDate: completionDate || null,
            certificateLink: certificateLink.trim() || null,
            progress: Number(progress),
            notes: notes.trim() || null,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tracked-courses/update/${id}`, updatedCourse);
            setMessage(response.data.message);
            setTimeout(() => {
                history.push('/'); // Navigate back to list after successful update
            }, 2000);
        } catch (error) {
            console.error('Error updating course:', error);
            setEditError(error.response?.data?.message || 'Failed to update course. Please try again.');
        }
    };

    return (
        <div>
            <h3>Edit Tracked Course</h3>
            {message && <div className="alert alert-info">{message}</div>}
            {editError && <div className="alert alert-danger">{editError}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="courseName">Course Name:</label>
                    <input
                        type="text"
                        id="courseName"
                        required
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Planned">Planned</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="instructor">Instructor (Optional):</label>
                    <input
                        type="text"
                        id="instructor"
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="completionDate">Completion Date (Optional):</label>
                    <input
                        type="date"
                        id="completionDate"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="certificateLink">Certificate Link (Optional):</label>
                    <input
                        type="text"
                        id="certificateLink"
                        value={certificateLink}
                        onChange={(e) => setCertificateLink(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="progress">Progress (%):</label>
                    <input
                        type="number"
                        id="progress"
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                        min="0"
                        max="100"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="notes">Notes (Optional):</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Update Course</button>
                </div>
            </form>
        </div>
    );
}

export default EditTrackedCourse;