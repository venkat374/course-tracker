import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserStats,
  logFocusSession,
  getPomodoroSettings,
  updatePomodoroSettings,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// USER STATS & POMODORO
router.get("/stats", isAuthenticated, getUserStats);
router.post("/pomodoro/log", isAuthenticated, logFocusSession);

// POMODORO SETTINGS
router.get("/pomodoro", isAuthenticated, getPomodoroSettings);
router.put("/pomodoro", isAuthenticated, updatePomodoroSettings);

export default router;
