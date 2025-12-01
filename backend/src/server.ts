// Dependencies
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRouter from "./routes/auth.routes";
import coursesRouter from "./routes/courses.routes";
import analyticsRouter from "./routes/analytics.routes";

dotenv.config();

// Validate environment variables
if (!process.env.ATLAS_URI) throw new Error("Missing ATLAS_URI in .env");
if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

// Express App Setup
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = ["http://localhost:4173"];

app.use(
  cors({
    origin: (origin: string | undefined, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error(`CORS policy does not allow access from ${origin}`),
        false
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

// MongoDB Connection
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRouter);
app.use("/courses", coursesRouter);
app.use("/analytics", analyticsRouter);

// Root Endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("The API runs");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
