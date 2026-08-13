import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createRoom, getRoom, getUserRooms, joinRoom, updateRoom, deleteRoom } from "../controllers/roomController.js";

const router = Router();
router.use(authMiddleware);
router.get("/", getUserRooms);
router.post("/", createRoom);
router.post("/:roomCode/join", joinRoom);
router.get("/:roomId", getRoom);
router.patch("/:roomId", updateRoom);
router.delete("/:roomId", deleteRoom);
export default router;

