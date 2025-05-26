const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// NEW: Import jsonwebtoken for middleware
const jwt = require('jsonwebtoken');

// CORS Configuration (Keep this as is for now, we'll update with deployed frontend URL later)
const allowedOrigins = [
    'http://localhost:3000',
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// --- Mongoose Schema & Model (TrackedCourse) ---
// Keep your existing TrackedCourse schema and model here.
// You removed the routes file before, so you had it all in server.js.
// If you want to use the routes system again, you would uncomment the next section.
// For now, let's keep it self-contained in server.js if you prefer:
const Schema = mongoose.Schema;

const trackedCourseSchema = new Schema({
    userId: { type: String, required: true },
    courseName: { type: String, required: true, trim: true, minlength: 3 },
    status: { type: String, required: true, enum: ['Ongoing', 'Completed', 'Planned'] },
    instructor: { type: String, required: false, trim: true },
    completionDate: { type: Date, required: false },
    certificateLink: { type: String, required: false, trim: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    notes: { type: String, required: false },
}, {
    timestamps: true,
});

const TrackedCourse = mongoose.model('TrackedCourse', trackedCourseSchema);

// --- NEW/MODIFIED: Authentication Middleware (using JWT) ---
const isAuthenticated = (req, res, next) => {
    const token = req.header('x-auth-token'); // Get token from header (common practice)

    // Check for token
    if (!token) {
        console.warn('Authentication failed: No token provided.');
        return res.status(401).json({ message: 'No authentication token, authorization denied.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user ID from token to request
        req.userId = decoded.id; // The 'id' field in our token payload
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

// --- NEW: Auth Routes ---
const authRouter = require('./routes/auth'); // Import auth routes
app.use('/auth', authRouter); // Mount auth routes under /auth prefix (e.g., /auth/register, /auth/login)


// --- API Routes (Existing Tracked Course Routes) ---
// Note: All existing routes will now use the new isAuthenticated middleware.

// GET: Retrieve all tracked courses for a specific user
app.get('/tracked-courses', isAuthenticated, (req, res) => {
    TrackedCourse.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .then(courses => res.json(courses))
        .catch(err => res.status(500).json({ message: 'Error fetching courses: ' + err.message }));
});

// POST: Add a new tracked course
app.post('/tracked-courses/add', isAuthenticated, (req, res) => {
    const { courseName, status, instructor, completionDate, certificateLink, progress, notes } = req.body;
    const userId = req.userId; // Get userId from the middleware

    if (!courseName || !status || progress === undefined) {
        return res.status(400).json({ message: 'Missing required fields: courseName, status, progress.' });
    }
    if (!['Ongoing', 'Completed', 'Planned'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: 'Progress must be a number between 0 and 100.' });
    }

    const newTrackedCourse = new TrackedCourse({
        userId,
        courseName,
        status,
        instructor: instructor || null,
        completionDate: completionDate ? new Date(completionDate) : null,
        certificateLink: certificateLink || null,
        progress: Number(progress),
        notes: notes || null,
    });

    newTrackedCourse.save()
        .then(() => res.status(201).json({ message: 'Course added successfully!' }))
        .catch(err => res.status(400).json({ message: 'Error adding course: ' + err.message }));
});

// GET: Retrieve a single tracked course by ID
app.get('/tracked-courses/:id', isAuthenticated, (req, res) => {
    TrackedCourse.findOne({ _id: req.params.id, userId: req.userId })
        .then(course => {
            if (!course) {
                return res.status(404).json({ message: 'Course not found or not authorized.' });
            }
            res.json(course);
        })
        .catch(err => res.status(500).json({ message: 'Error fetching course: ' + err.message }));
});

// POST: Update an existing tracked course by ID
app.post('/tracked-courses/update/:id', isAuthenticated, (req, res) => {
    TrackedCourse.findOne({ _id: req.params.id, userId: req.userId })
        .then(course => {
            if (!course) {
                return res.status(404).json({ message: 'Course not found or not authorized to update.' });
            }

            course.courseName = req.body.courseName;
            course.status = req.body.status;
            course.instructor = req.body.instructor || null;
            course.completionDate = req.body.completionDate ? new Date(req.body.completionDate) : null;
            course.certificateLink = req.body.certificateLink || null;
            course.progress = Number(req.body.progress);
            course.notes = req.body.notes || null;

            course.save()
                .then(() => res.json({ message: 'Course updated successfully!' }))
                .catch(err => res.status(400).json({ message: 'Error updating course: ' + err.message }));
        })
        .catch(err => res.status(500).json({ message: 'Error: ' + err.message }));
});

// DELETE: Delete a tracked course by ID
app.delete('/tracked-courses/:id', isAuthenticated, (req, res) => {
    TrackedCourse.deleteOne({ _id: req.params.id, userId: req.userId })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Course not found or not authorized to delete.' });
            }
            res.json({ message: 'Course deleted successfully.' });
        })
        .catch(err => res.status(500).json({ message: 'Error deleting course: ' + err.message }));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});