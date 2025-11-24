import mongoose, { Document, Schema } from "mongoose";

//
// 1️⃣ TS Interface: This defines the shape of a User document
//
export interface PomodoroSettings {
  focusMinutes: number;
  breakMinutes: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // Emoji or icon name
  description: string;
  dateEarned: Date;
}

export interface IUser extends Document {
  username: string;
  password: string;
  streak: number;
  lastLogin: Date | null;
  pomodoroSettings: PomodoroSettings;
  totalFocusMinutes: number;
  focusHistory: { date: string; minutes: number; sessions: number }[];
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
}

//
// 2️⃣ Mongoose Schema with full types
//
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    streak: {
      type: Number,
      default: 0,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    pomodoroSettings: {
      focusMinutes: { type: Number, default: 25 },
      breakMinutes: { type: Number, default: 5 },
    },

    totalFocusMinutes: {
      type: Number,
      default: 0,
    },

    focusHistory: [
      {
        date: { type: String, required: true }, // Format: "YYYY-MM-DD"
        minutes: { type: Number, required: true },
        sessions: { type: Number, default: 0 },
      },
    ],

    badges: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: String, required: true },
        description: { type: String, required: true },
        dateEarned: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

//
// 3️⃣ Export the model
//
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
