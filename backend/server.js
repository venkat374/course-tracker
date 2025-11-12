//Dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//Express App Setup
const app = express();
const port = 5000;

//Middleware
app.use(express.json()); //Parse JSON bodies

//CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!allowedOrigins.includes(origin)) {
        const msg = `CORS policy does not allow access from origin ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

//MongoDB Connection
const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("MongoDB database connected")
  )
  .catch((err) => console.error("MongoDB error:", err));


//Auth Routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const trackedCoursesRouter = require("./routes/courses.routes.js");
app.use("/tracked-courses", trackedCoursesRouter);

//Root Endpoint
app.get("/", (req, res) => {
  res.send("The API runs");
});

//Start Server
app.listen(port, () => {
  console.log(`The server runs at PORT: ${port}`);
});
