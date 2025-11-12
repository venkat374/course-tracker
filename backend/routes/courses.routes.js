//routes for tracked courses

const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middleware/authMiddleWare");

const { getCourses, createCourse, getCourse, updatedCourse, deletedCourse } = require("../controllers/courses.controller");

//GET: get all the courses for the userId
router.get("/", isAuthenticated, getCourses);

//POST: Add a course
router.post("/", isAuthenticated, createCourse);

//GET: get course by id
router.get("/:id", isAuthenticated, getCourse);

//POST: Update course by id
router.patch("/:id", isAuthenticated, updatedCourse);

//Delete: Delete a course by Id
router.delete("/:id", isAuthenticated, deletedCourse);

module.exports = router;


