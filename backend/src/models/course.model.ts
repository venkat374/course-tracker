import mongoose, { Schema, Document } from "mongoose";

// Course Interface
export interface ICourse extends Document {
  userId: string;
  courseName: string;
  platform: string;
  status: "Ongoing" | "Completed" | "Planned";
  instructor?: string | null;
  completionDate?: Date | null;
  certificateLink?: string | null;
  progress: number;
  notes?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// Schema
const CourseSchema = new Schema<ICourse>(
  {
    userId: {
      type: String,
      required: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: [
        "Udemy",
        "Coursera",
        "YouTube",
        "freeCodeCamp",
        "LeetCode",
        "LBRY",
        "Skillshare",
        "CS50",
        "Other",
      ],
      default: "Other",
    },

    status: {
      type: String,
      required: true,
      enum: ["Ongoing", "Completed", "Planned"],
    },

    instructor: {
      type: String,
      trim: true,
    },

    completionDate: {
      type: Date,
    },

    certificateLink: {
      type: String,
      trim: true,
    },

    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model<ICourse>("Course", CourseSchema);
export default Course;