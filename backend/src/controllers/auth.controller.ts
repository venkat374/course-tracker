import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

// ---------------------------
// TYPES
// ---------------------------
interface AuthBody {
  username: string;
  password: string;
}

interface PomodoroBody {
  focusMinutes: number;
  breakMinutes: number;
}

interface TokenPayload {
  id: string;
}

// ---------------------------
// REGISTER USER
// ---------------------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password }: AuthBody = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Please enter all fields." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username already exists." });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashed,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (err: any) {
    console.error("Registration Error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ---------------------------
// LOGIN USER (Calendar-Based Streak Logic)
// ---------------------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password }: AuthBody = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Please enter all fields." });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    // ------------- CALENDAR BASED STREAK LOGIC -------------
    const today = new Date();
    const todayStr = today.toDateString();

    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    const lastLoginStr = lastLogin ? lastLogin.toDateString() : null;

    // Yesterday date
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (!lastLogin) {
      // First login ever
      user.streak = 1;
    } else if (lastLoginStr === todayStr) {
      // Already logged in today → streak stays the same
    } else if (lastLoginStr === yesterdayStr) {
      // Logged in yesterday → increment streak
      user.streak += 1;
    } else {
      // Missed one or more days → restart streak
      user.streak = 1;
    }

    // Update last login
    user.lastLogin = today;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1y",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        streak: user.streak,
      },
      message: "Logged in successfully!",
    });
  } catch (err: any) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ---------------------------
// GET USER STATS (Streak + Focus Time)
// ---------------------------
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      streak: user.streak,
      totalFocusMinutes: user.totalFocusMinutes || 0,
      focusHistory: user.focusHistory || [],
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// LOG FOCUS SESSION
// ---------------------------
// ---------------------------
// LOG FOCUS SESSION & CHECK BADGES
// ---------------------------
import PomodoroSession from "../models/pomodoro.model";

export const logFocusSession = async (req: Request, res: Response) => {
  try {
    const { minutes, courseId } = req.body; // Added courseId
    if (!minutes || minutes <= 0) {
      return res.status(400).json({ message: "Invalid minutes" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Create Pomodoro Session
    const newSession = new PomodoroSession({
      userId: user._id,
      courseId: courseId || null,
      duration: minutes,
      completedAt: new Date(),
    });
    await newSession.save();

    // 2. Update User Stats
    user.totalFocusMinutes = (user.totalFocusMinutes || 0) + minutes;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const historyIndex = user.focusHistory.findIndex((h) => h.date === todayStr);

    if (historyIndex > -1) {
      user.focusHistory[historyIndex].minutes += minutes;
      user.focusHistory[historyIndex].sessions = (user.focusHistory[historyIndex].sessions || 0) + 1;
    } else {
      user.focusHistory.push({ date: todayStr, minutes, sessions: 1 });
    }

    // 3. BADGE LOGIC
    const newBadges: string[] = [];
    const currentHour = today.getHours();

    // Helper to add badge if not already earned
    const addBadge = (id: string, name: string, icon: string, description: string) => {
      if (!user.badges.some((b) => b.id === id)) {
        user.badges.push({ id, name, icon, description, dateEarned: new Date() });
        newBadges.push(name);
      }
    };

    // "Early Bird" (before 7 AM)
    if (currentHour < 7) {
      addBadge("early-bird", "Early Bird", "🌅", "Completed a session before 7 AM");
    }

    // "Night Owl" (after 10 PM / 22:00)
    if (currentHour >= 22) {
      addBadge("night-owl", "Night Owl", "🦉", "Completed a session after 10 PM");
    }

    // "10-Day Streak"
    if (user.streak >= 10) {
      addBadge("10-day-streak", "10-Day Streak", "🔥", "Maintained a 10-day streak");
    }

    // "Completed 10 tasks this week"
    // Count sessions in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const recentSessionsCount = await PomodoroSession.countDocuments({
      userId: user._id,
      completedAt: { $gte: sevenDaysAgo },
    });

    if (recentSessionsCount >= 10) {
      addBadge("10-tasks-week", "Productive Week", "🚀", "Completed 10 sessions this week");
    }

    await user.save();

    return res.json({
      message: "Session logged",
      totalFocusMinutes: user.totalFocusMinutes,
      todayMinutes: historyIndex > -1 ? user.focusHistory[historyIndex].minutes : minutes,
      todaySessions: historyIndex > -1 ? user.focusHistory[historyIndex].sessions : 1,
      newBadges, // Return new badges to frontend for animation
    });
  } catch (err) {
    console.error("Log Session Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// GET POMODORO SETTINGS
// ---------------------------
export const getPomodoroSettings = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    return res.json(user.pomodoroSettings);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// UPDATE POMODORO SETTINGS
// ---------------------------
export const updatePomodoroSettings = async (req: Request, res: Response) => {
  try {
    const { focusMinutes, breakMinutes }: PomodoroBody = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { pomodoroSettings: { focusMinutes, breakMinutes } },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    return res.json(user.pomodoroSettings);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
