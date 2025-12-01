import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

router.get("/", isAuthenticated, getAnalytics);

export default router;
