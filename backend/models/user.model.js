// --- Mongoose Schema ---
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        streak: {
            type: Number,
            default: 0
        },
        lastLogin: {
            type: Date,
            default: null
        },
        pomodoroSettings: {
            focusMinutes: { type: Number, default: 25 },
            breakMinutes: { type: Number, default: 5 }
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);