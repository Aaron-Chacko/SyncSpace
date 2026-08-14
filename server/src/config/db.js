import mongoose from "mongoose";
import path from "path";
import fs from "fs";

let mongoMemoryServer = null;

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    try {
      const connection = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 1500,
      });

      console.log("✅ MongoDB Connected Successfully (Primary DB)");
      console.log(`🗄️ Host        : ${connection.connection.host}`);
      console.log(`📂 Database    : ${connection.connection.name}`);
      console.log(`⏱️ Connected At: ${new Date().toLocaleTimeString()}`);

      return connection;
    } catch (error) {
      console.warn("⚠️ Primary MongoDB Connection Failed (No local mongod running on 27017).");
    }
  }

  // Automatic Persistent Fallback MongoDB Server if primary DB connection is offline
  try {
    console.log("🔄 Starting Persistent Fallback Database Server...");
    const { MongoMemoryServer } = await import("mongodb-memory-server");

    // Ensure persistent data directory exists inside server/data/db
    const dbPath = path.join(process.cwd(), "data", "db");
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbPath,
        storageEngine: "wiredTiger",
      },
    });

    const uri = mongoMemoryServer.getUri();
    const connection = await mongoose.connect(uri);

    console.log("✅ MongoDB Connected (Persistent Local Database Server Active)");
    console.log(`📂 Data Path        : ${dbPath}`);
    console.log(`⏱️ Connected At     : ${new Date().toLocaleTimeString()}`);

    return connection;
  } catch (fallbackError) {
    console.warn("⚠️ Persistent storage init failed, trying transient memory server:", fallbackError.message);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      const connection = await mongoose.connect(uri);
      console.log("✅ MongoDB Connected (Transient In-Memory Fallback Server Active)");
      return connection;
    } catch (err) {
      console.error("❌ Fallback MongoDB Server Failed:", err.message);
      mongoose.set("bufferCommands", false);
      return null;
    }
  }
};

export default connectDB;