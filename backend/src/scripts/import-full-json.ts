import fs from "fs";
import path from "path";
import { connectDB } from "../utils/database.js";
import { RecordModel } from "../models/Record.model.js";
import mongoose from "mongoose";

const BATCH_SIZE = 10000;

async function importFromJSON() {
  try {
    console.log("🚀 Starting MongoDB import from Dataset.json...");

    // Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Check file exists
    const datasetPath = path.resolve("./data/Dataset.json");
    if (!fs.existsSync(datasetPath)) {
      throw new Error("Dataset.json not found in data/ folder");
    }

    // Get file size
    const stats = fs.statSync(datasetPath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = Math.round(fileSizeInBytes / (1024 * 1024));

    console.log(`📄 Source: ${datasetPath}`);
    console.log(`🗃️  Target: MongoDB Database "higo"`);
    console.log(`📁 File size: ${fileSizeInMB} MB`);

    // Clear existing records
    console.log("🗑️  Clearing existing records...");
    const deleteResult = await RecordModel.deleteMany({});
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing records`);

    // Read and parse JSON
    console.log("📖 Reading JSON file...");
    const jsonData = JSON.parse(fs.readFileSync(datasetPath, "utf8"));

    if (!Array.isArray(jsonData)) {
      throw new Error("Dataset.json must contain an array of records");
    }

    console.log(`📊 Found ${jsonData.length.toLocaleString()} records in JSON`);

    // Process in batches
    console.log("📥 Starting batch processing...");
    const startTime = Date.now();
    let processedCount = 0;
    let totalErrors = 0;

    for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
      const batch = jsonData.slice(i, i + BATCH_SIZE);

      try {
        // Transform data for MongoDB
        const transformedBatch = batch.map((record: any, index: number) => {
          const birthYear = parseInt(record.Age) || 1990;
          const currentYear = new Date().getFullYear();
          const calculatedAge = currentYear - birthYear;

          return {
            number: i + index + 1,
            locationName: record["Name of Location"] || record.locationName,
            date: record.Date ? new Date(record.Date) : new Date(),
            loginHour: record["Login Hour"] || record.loginHour,
            name: record.Name || record.name,
            age: Math.max(1, Math.min(calculatedAge, 150)), // Ensure age is valid
            gender: record.gender,
            email: record.Email || record.email,
            phone: record["No Telp"] || record.noTelp || record.phone,
            brandDevice: record["Brand Device"] || record.brandDevice,
            digitalInterest:
              record["Digital Interest"] || record.digitalInterest,
            locationType: record["Location Type"] || record.locationType,
          };
        });

        // Insert batch to MongoDB
        await RecordModel.insertMany(transformedBatch, {
          ordered: false,
          rawResult: false,
        });

        processedCount += batch.length;
        const rate = Math.round(
          processedCount / ((Date.now() - startTime) / 1000)
        );
        console.log(
          `📈 Progress: ${processedCount.toLocaleString()} / ${jsonData.length.toLocaleString()} records (${rate}/sec)`
        );
      } catch (error) {
        if (error instanceof Error) {
          const batchErrors = error.message.includes("E11000")
            ? batch.length
            : 1; // Assume all duplicates if E11000
          totalErrors += batchErrors;
          console.log(
            `⚠️  Batch ${Math.floor(i / BATCH_SIZE) + 1} errors: ${batchErrors}`
          );
        }
      }
    }

    // Setup indexes for better performance
    console.log("🔧 Creating database indexes...");
    try {
      await RecordModel.collection.createIndex(
        { number: 1 },
        { unique: true, background: true }
      );
      await RecordModel.collection.createIndex(
        { email: 1 },
        { background: true }
      );
      await RecordModel.collection.createIndex(
        { gender: 1 },
        { background: true }
      );
      await RecordModel.collection.createIndex(
        { locationType: 1 },
        { background: true }
      );
      await RecordModel.collection.createIndex(
        { locationName: 1 },
        { background: true }
      );
      await RecordModel.collection.createIndex(
        { digitalInterest: 1 },
        { background: true }
      );
      await RecordModel.collection.createIndex(
        { brandDevice: 1 },
        { background: true }
      );
      await RecordModel.collection.createIndex(
        { age: 1 },
        { background: true }
      );
      await RecordModel.collection.createIndex(
        { date: -1 },
        { background: true }
      );
      console.log("✅ Database indexes created");
    } catch (indexError) {
      console.log("⚠️  Some indexes may already exist");
    }

    // Final verification
    console.log("🔍 Verifying data in MongoDB...");
    const finalCount = await RecordModel.countDocuments();

    const duration = (Date.now() - startTime) / 1000;
    const avgRate = Math.round(processedCount / duration);

    console.log("");
    console.log("🎉 Import completed!");
    console.log(
      `📊 Total processed: ${processedCount.toLocaleString()} records`
    );
    console.log(
      `📝 Total records in JSON: ${jsonData.length.toLocaleString()}`
    );
    console.log(`⚠️  Total errors: ${totalErrors.toLocaleString()}`);
    console.log(`✅ Records in MongoDB: ${finalCount.toLocaleString()}`);
    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
    console.log(`🚀 Average rate: ${avgRate.toLocaleString()} records/sec`);

    if (finalCount === 0) {
      console.log("❌ No records were imported! Check data format.");
    } else if (finalCount < jsonData.length * 0.9) {
      console.log(
        "⚠️  Import completed but with significant data loss. Check error logs."
      );
    } else {
      console.log("🎊 Import successful! Ready for API testing.");
    }
  } catch (error) {
    console.error("❌ Import failed:", (error as Error).message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

importFromJSON();
