import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: [true, "Room code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^[A-Z0-9]{6}$/,
        "Room code must be exactly 6 uppercase letters or numbers",
      ],
    },

    roomName: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      minlength: [3, "Room name must be at least 3 characters long"],
      maxlength: [50, "Room name cannot exceed 50 characters"],
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;