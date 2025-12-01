import mongoose, { Schema, Document } from "mongoose";

// Pomodoro Interface
export interface IPomodoroSession extends Document {
    userId: string;
    courseId?: string; // Optional
    duration: number;
    completedAt: Date;
}

// Schema
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
