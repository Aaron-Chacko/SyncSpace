import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSession } from "../controllers/sessionController.js";

const router = Router();
router.get("/:roomId", authMiddleware, getSession);
export default router;
