import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅ MongoDB Connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.warn("⚠️ Server will continue running without MongoDB persistence.");
  }
};

export default connectDB;