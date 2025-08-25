import { connectDB } from "../utils/database.js";
import mongoose from "mongoose";

async function resetDatabase() {
  try {
    console.log("🗑️  Starting database reset...");

    // Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Drop the entire higo database
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log('✅ Database "higo" dropped successfully');
    }

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");

    console.log("🎉 Database reset completed!");
    console.log("💡 Ready for fresh import with: npm run import:full");
  } catch (error) {
    console.error("❌ Database reset failed:", (error as Error).message);
  }
}

resetDatabase();
