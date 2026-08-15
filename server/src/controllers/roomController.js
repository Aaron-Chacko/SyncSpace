import crypto from "crypto";
import mongoose from "mongoose";
import Room from "../models/Room.js";

const roomQuery = (identifier) => ({
  $or: [
    ...(mongoose.isValidObjectId(identifier) ? [{ _id: identifier }] : []),
    { roomCode: String(identifier).toUpperCase() },
  ],
});
const memberQuery = (userId) => ({ $or: [{ creator: userId }, { participants: userId }] });
const roomResponse = (room) => ({
  id: room.id,
  roomCode: room.roomCode,
  roomName: room.roomName,
  description: room.description,
  creator: room.creator,
  participants: room.participants,
  isActive: room.isActive,
  createdAt: room.createdAt,
});

const createRoomCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i += 1) {
    code += alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return code;
};
export async function createRoom(req, res, next) {
  try {
    const { roomName, description = "" } = req.body;
    if (!roomName?.trim()) return res.status(400).json({ message: "Room name is required." });

    let room;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        room = await Room.create({
          roomCode: createRoomCode(),
          roomName: roomName.trim(),
          description: String(description).trim(),
          creator: req.user.id,
          participants: [req.user.id],
          editors: [req.user.id],
        });
        break;
      } catch (error) {
        if (error.code !== 11000 || attempt === 4) throw error;
      }
    }
    return res.status(201).json({ room: roomResponse(room) });
  } catch (error) {
    return next(error);
  }
}

export async function getRoom(req, res, next) {
  try {
    const room = await Room.findOne({ $and: [roomQuery(req.params.roomId), memberQuery(req.user.id), { isActive: true }] });
    if (!room) return res.status(404).json({ message: "Room not found, inactive, or access denied." });
    return res.json({ room: roomResponse(room) });
  } catch (error) {
    return next(error);
  }
}

export async function joinRoom(req, res, next) {
  try {
    const room = await Room.findOne({ roomCode: req.params.roomCode.toUpperCase(), isActive: true });
    if (!room) return res.status(404).json({ message: "Room not found or inactive." });
    if (!room.participants.some((participant) => participant.equals(req.user.id))) {
      room.participants.push(req.user.id);
      await room.save();
    }
    return res.json({ room: roomResponse(room) });
  } catch (error) {
    return next(error);
  }
}

export async function updateRoom(req, res, next) {
  try {
    const room = await Room.findOne({ ...roomQuery(req.params.roomId), creator: req.user.id });
    if (!room) return res.status(403).json({ message: "Only the room creator can update this room." });
    if (req.body.roomName !== undefined) room.roomName = String(req.body.roomName).trim();
    if (req.body.description !== undefined) room.description = String(req.body.description).trim();
    if (req.body.isActive !== undefined) room.isActive = Boolean(req.body.isActive);
    await room.save();
    return res.json({ room: roomResponse(room) });
  } catch (error) {
    return next(error);
  }
}

export async function getUserRooms(req, res, next) {
  try {
    const rooms = await Room.find({
      $or: [{ creator: req.user.id }, { participants: req.user.id }],
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .populate("creator", "name email");

    return res.json({ rooms: rooms.map(roomResponse) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteRoom(req, res, next) {
  try {
    const room = await Room.findOne({ ...roomQuery(req.params.roomId), creator: req.user.id });
    if (!room) return res.status(403).json({ message: "Only the room creator can delete this room." });
    room.isActive = false;
    await room.save();
    return res.json({ message: "Room deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

