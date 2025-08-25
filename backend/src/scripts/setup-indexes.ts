import mongoose from "mongoose";
import dotenv from "dotenv";
import { RecordModel } from "../models/Record.model";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/higo";

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB:", MONGODB_URI);
}

export async function setupIndexes() {
  await connectDB();

  console.log("Setting up database indexes...");

  try {
    // Create indexes for better query performance
    await RecordModel.collection.createIndex({ number: 1 }, { unique: false });
    await RecordModel.collection.createIndex({ gender: 1 });
    await RecordModel.collection.createIndex({ locationType: 1 });
    await RecordModel.collection.createIndex({ digitalInterest: 1 });
    await RecordModel.collection.createIndex({ brandDevice: 1 });
    await RecordModel.collection.createIndex({ locationName: 1 });
    await RecordModel.collection.createIndex({ date: 1 });
    await RecordModel.collection.createIndex({ createdAt: 1 });
    await RecordModel.collection.createIndex({ updatedAt: 1 });

    // Compound indexes for common queries
    await RecordModel.collection.createIndex({ gender: 1, locationType: 1 });
    await RecordModel.collection.createIndex({ gender: 1, digitalInterest: 1 });
    await RecordModel.collection.createIndex({ date: 1, gender: 1 });
    await RecordModel.collection.createIndex({
      locationType: 1,
      digitalInterest: 1,
    });

    // Text index for search functionality
    await RecordModel.collection.createIndex({
      name: "text",
      locationName: "text",
      email: "text",
      digitalInterest: "text",
    });

    console.log("✅ All indexes created successfully");

    // Display existing indexes
    const indexes = await RecordModel.collection.indexes();
    console.log(
      "Current indexes:",
      indexes.map((idx) => idx.name)
    );
  } catch (error) {
    console.error("Error creating indexes:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  setupIndexes()
    .then(() => {
      console.log("Index setup completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Index setup failed:", error);
      process.exit(1);
    });
}
