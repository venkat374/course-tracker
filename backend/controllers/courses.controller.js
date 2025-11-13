import Courses from "../models/course.model.js";

//get all route controller
export const getCourses = async (req, res) => {
    try {
        const courses = await Courses.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(courses);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching courses: " +err.message});
    }
};

//put route controller
export const createCourse = async (req, res) => {
    try {
        const { courseName, status, instructor, completionDate, certificateLink, progress, notes } = req.body;

        if(!courseName || !status || progress === undefined) {
            return res.status(400).json({ message: "Missing requried fields" });
        }

        const newCourse = new Courses({
            userId: req.userId,
            courseName,
            status,
            instructor: instructor || null,
            completionDate: completionDate ? new Date(completionDate) : null,
            certificateLink: certificateLink || null,
            progress: Number(progress),
            notes: notes || null
        });

        await newCourse.save();
        res.status(201).json({ message: "Added course successfully" });
    }

    catch(err) {
        res.status(400).json({ message: "Error adding a new course: " +err.message});
    }
};

//get by id route controller
export const getCourse = async (req, res) => {
    try {
        const course = await Courses.findOne({ _id:req.params.id, userId: req.userId});
        if(!course) {
            return res.status(404).json({ message: "Error finding the course" });
        }

        res.json(course);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching the course: "+err.message});
    }
};

//patch route controller
export const updatedCourse = async (req, res) => {
    try {
        const course = await Courses.findOne({ _id: req.params.id, userId: req.userId });
        if(!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        Object.assign(course, {
            courseName: req.body.courseName,
            status: req.body.status,
            instructor: req.body.instructor || null,
            completionDate: req.body.completionDate ? new Date(req.body.completionDate) : null,
            certificateLink: req.body.certificateLink || null,
            progress: Number(req.body.progress),
            notes: req.body.notes || null,
        });

        await course.save()
        res.status(200).json({ message: "Course updated successfully", course });
    }

    catch (err) {
        res.status(500).json({ message: "Error updating the course: "+err.message });
    }
};

//delete route controller
export const deletedCourse = async (req, res) => {
    try {
        const result = await Courses.deleteOne({ _id: req.params.id, userId: req.userId });
        if(result.deletedCount === 0) {
            return res.status(404).json({ message: "Could not find the course id" });
        }
        res.status(200).json({ message: "Deleted the course successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting the course: "+err.message});
    }
};