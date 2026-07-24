import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
      unique: true,
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
      trim: true,
      lowercase: true,
      enum: [
        "javascript",
        "typescript",
        "python",
        "java",
        "cpp",
        "c",
        "go",
        "rust",
      ],
    },

    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;