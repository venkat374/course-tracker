import { Request, Response } from "express";
import Course from "../models/course.model";
import User from "../models/user.model";
import PomodoroSession from "../models/pomodoro.model";

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // 1. Platform Stats
        // Group courses by platform and count them
        const platformStats = await Course.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$platform",
                    count: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                    },
                },
            },
        ]);

        // 2. Pomodoro Stats by Course
        // Join PomodoroSessions with Courses to get course names
        const sessionStats = await PomodoroSession.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$courseId",
                    totalMinutes: { $sum: "$duration" },
                    sessions: { $sum: 1 },
                },
            },
        ]);

        // Populate course names for session stats
        const enrichedSessionStats = await Promise.all(
            sessionStats.map(async (stat) => {
                if (!stat._id) return { ...stat, courseName: "General Focus" };
                const course = await Course.findById(stat._id, "courseName");
                return { ...stat, courseName: course ? course.courseName : "Unknown Course" };
            })
        );

        // 3. Badges
        const user = await User.findById(userId, "badges");

        return res.json({
            platformStats,
            sessionStats: enrichedSessionStats,
            badges: user ? user.badges : [],
        });
    } catch (err) {
        console.error("Analytics Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
