const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    console.warn("Authentication failed: No token provided.");
    return res
      .status(401)
      .json({ message: "No authentication token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; //attach user ID
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid." });
  }
};

module.exports = { isAuthenticated };