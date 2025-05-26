// frontend/src/components/AddTrackedCourse.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function AddTrackedCourse({ loggedInUserId }) { // loggedInUserId is still needed for saving to DB
    const [courseName, setCourseName] = useState('');
    const [status, setStatus] = useState('Ongoing');
    const [instructor, setInstructor] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [certificateLink, setCertificateLink] = useState('');
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [addError, setAddError] = useState('');
    const history = useHistory();

    const onSubmit = async (e) => {
        e.preventDefault();
        setAddError('');
        setMessage('');

        // Client-side Validation (as before)
        if (!courseName.trim()) {
            setAddError('Course Name is required.');
            return;
        }
        if (progress < 0 || progress > 100) {
            setAddError('Progress must be between 0 and 100.');
            return;
        }

        // Construct the new course object
        const newTrackedCourse = {
            userId: loggedInUserId, // STILL REQUIRED: This links the course to the user in the database
            courseName,
            status,
            instructor: instructor.trim() || null,
            completionDate: completionDate || null,
            certificateLink: certificateLink.trim() || null,
            progress: parseInt(progress, 10),
            notes: notes.trim() || null,
        };

        try {
            // Updated axios.post URL to use template literals (important fix from earlier)
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tracked-courses/add`, newTrackedCourse);
            setMessage(response.data.message);

            // Reset form fields
            setCourseName('');
            setStatus('Ongoing');
            setInstructor('');
            setCompletionDate('');
            setCertificateLink('');
            setProgress(0);
            setNotes('');

            // Navigate to the list page
            setTimeout(() => {
                history.push('/');
            }, 2000);
        } catch (error) {
            console.error('Error adding tracked course:', error);
            setAddError(error.response?.data?.message || 'Failed to add course. Please try again.');
        }
    };

    return (
        <div>
            <h3>Add New Tracked Course</h3>
            {message && <div className="alert alert-info">{message}</div>}
            {addError && <div className="alert alert-danger">{addError}</div>}
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
                    <button type="submit" className="btn btn-primary">Add Course</button>
                </div>
            </form>
        </div>
    );
}

export default AddTrackedCourse;