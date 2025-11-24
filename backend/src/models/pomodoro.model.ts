import mongoose, { Schema, Document } from "mongoose";

export interface IPomodoroSession extends Document {
    userId: string;
    courseId?: string; // Optional: link to a specific course
    duration: number; // in minutes
    completedAt: Date;
}

const PomodoroSessionSchema = new Schema<IPomodoroSession>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        courseId: {
            type: String,
            default: null,
        },
        duration: {
            type: Number,
            required: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const PomodoroSession = mongoose.model<IPomodoroSession>(
    "PomodoroSession",
    PomodoroSessionSchema
);

export default PomodoroSession;
