//Mongoose Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trackedCourseSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        courseName: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Ongoing", "Completed", "Planned"]
        },
        instructor: {
            type: String,
            trim: true
        },
        completionDate: {
            type: Date
        },
        certificateLink: {
            type: String,
            trim: true
        },
        progress: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        notes: {
            type: String
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Courses", trackedCourseSchema);