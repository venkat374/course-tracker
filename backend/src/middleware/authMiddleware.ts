import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Extend JWT payload to match what we sign
interface TokenPayload extends JwtPayload {
  id: string;
}

// Authentication Middleware
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const token = req.header("x-auth-token");

  if (!token) {
    console.warn("Authentication failed: No token provided.");
    return res
      .status(401)
      .json({ message: "No authentication token, authorization denied." });
  }

  try {
    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    // attach userId to request (typed via express.d.ts)
    req.userId = decoded.id;

    return next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Token is not valid." });
  }
};
