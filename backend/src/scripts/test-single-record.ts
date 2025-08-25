import { connectDB } from "../utils/database.js";
import { RecordModel } from "../models/Record.model.js";
import mongoose from "mongoose";

async function testSingleRecord() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Test with one record
    const testRecord = {
      number: 1,
      locationName: "The Rustic Tavern",
      date: new Date("12/07/2023"),
      loginHour: "16:07",
      name: "Francesca Spendlove",
      age: 2025 - 1978, // Calculate age from birth year
      gender: "Female",
      email: "fspendlove0@eventbrite.com",
      phone: "829-817-4593",
      brandDevice: "Samsung",
      digitalInterest: "Social Media",
      locationType: "urban",
    };

    console.log("📝 Test record:", JSON.stringify(testRecord, null, 2));

    const savedRecord = await RecordModel.create(testRecord);
    console.log("✅ Record saved successfully:", savedRecord._id);

    const count = await RecordModel.countDocuments();
    console.log(`📊 Total records in DB: ${count}`);
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
  } finally {
    await mongoose.connection.close();
  }
}

testSingleRecord();
