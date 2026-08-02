import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set; starting without database persistence.");
    return null;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 2000,
});

console.log(`MongoDB connected: ${connection.connection.host}`);
return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.warn("Server will continue running in offline/demo mode without MongoDB persistence.");
    return null;
  }
};

export default connectDB;
