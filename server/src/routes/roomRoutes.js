import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createRoom, getRoom, joinRoom, updateRoom } from "../controllers/roomController.js";

const router = Router();
router.use(authMiddleware);
router.post("/", createRoom);
router.post("/:roomCode/join", joinRoom);
router.get("/:roomId", getRoom);
router.patch("/:roomId", updateRoom);
export default router;
