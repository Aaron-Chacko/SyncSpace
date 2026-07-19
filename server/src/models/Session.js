import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    whiteboardData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    editorData: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "javascript",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;