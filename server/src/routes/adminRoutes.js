import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { listUsers } from "../controllers/adminController.js";

const router = Router();
router.use(authMiddleware, requireRole("admin"));
router.get("/users", listUsers);

export default router;
