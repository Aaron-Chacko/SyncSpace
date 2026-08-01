import Room from "../models/Room.js";
import Session from "../models/Session.js";
import mongoose from "mongoose";

export async function getSession(req, res, next) {
  try {
    const room = await Room.findOne({
      $and: [
        { $or: [
          ...(mongoose.isValidObjectId(req.params.roomId) ? [{ _id: req.params.roomId }] : []),
          { roomCode: req.params.roomId.toUpperCase() },
        ] },
        { $or: [{ creator: req.user.id }, { participants: req.user.id }] },
        { isActive: true },
      ],
    });
    if (!room) return res.status(404).json({ message: "Room not found, inactive, or access denied." });
    const session = await Session.findOne({ room: room.id });
    return res.json({ session });
  } catch (error) {
    return next(error);
  }
}
