import { Request, Response } from "express";
import Course from "../models/course.model";
import User from "../models/user.model";

// Get All Courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // comes from authMiddleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found." });
    }

    const courses = await Course.find({ userId }).sort({ createdAt: -1 });

    return res.json(courses);
  } catch (err: any) {
    console.error("Error fetching courses:", err);
    return res.status(500).json({ message: "Server error fetching courses." });
  }
};

// Create a Course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found." });
    }

    const newCourse = new Course({
      userId,
      ...req.body,
    });

    await newCourse.save();

    return res.status(201).json({
      message: "Course added successfully!",
      course: newCourse,
    });
  } catch (err: any) {
    console.error("Error creating course:", err);
    return res.status(500).json({ message: "Server error adding course." });
  }
};

// Get Course by ID
export const getCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    return res.json(course);
  } catch (err: any) {
    console.error("Error fetching course:", err);
    return res.status(500).json({ message: "Server error fetching course." });
  }
};


// Update Course by ID
export const updatedCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;

    const updated = await Course.findByIdAndUpdate(
      courseId,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Update course count and check for badge eligibility
    if (updated.status === "Completed") {
      const completedCount = await Course.countDocuments({ userId: req.userId, status: "Completed" });
      if (completedCount >= 3) {
        const user = await User.findById(req.userId);
        if (user && !user.badges.some(b => b.id === "3-courses")) {
          user.badges.push({
            id: "3-courses",
            name: "Course Master",
            icon: "🎓",
            description: "Completed 3 courses",
            dateEarned: new Date()
          });
          await user.save();
        }
      }
    }

    return res.json({
      message: "Course updated successfully.",
      course: updated,
    });
  } catch (err: any) {
    console.error("Error updating course:", err);
    return res.status(500).json({ message: "Server error updating course." });
  }
};

// Delete a Course
export const deletedCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;

    const deleted = await Course.findByIdAndDelete(courseId);

    if (!deleted) {
      return res.status(404).json({ message: "Course not found." });
    }

    return res.json({ message: "Course deleted successfully." });
  } catch (err: any) {
    console.error("Error deleting course:", err);
    return res.status(500).json({ message: "Server error deleting course." });
  }
};
