// NOTE:
// Using non-SRV MongoDB URI because SRV fails on some networks (e.g., mobile hotspot DNS issues)

import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MongoDB URI Not Found");
    console.warn("🚀 Starting backend in Offline/Demo Mode.");
    return null;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log("✅ MongoDB Connected Successfully");
    console.log(`🗄️ Host        : ${connection.connection.host}`);
    console.log(`📂 Database    : ${connection.connection.name}`);
    console.log(`⏱️ Connected At: ${new Date().toLocaleTimeString()}`);

    return connection;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(`📄 Reason      : ${error.message}`);
    console.warn("⚠️ Backend will continue in Offline/Demo Mode without MongoDB.");

    return null;
  }
};

export default connectDB;