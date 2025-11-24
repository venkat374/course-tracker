import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";

import {
  getCourses,
  createCourse,
  getCourse,
  updatedCourse,
  deletedCourse,
} from "../controllers/courses.controller";

const router = Router();

// GET all courses for logged-in user
router.get("/", isAuthenticated, getCourses);

// CREATE a new course
router.post("/", isAuthenticated, createCourse);

// GET a single course
router.get("/:id", isAuthenticated, getCourse);

// UPDATE a course
router.patch("/:id", isAuthenticated, updatedCourse);

// DELETE a course
router.delete("/:id", isAuthenticated, deletedCourse);

export default router;
