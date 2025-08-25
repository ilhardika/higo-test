import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { RecordModel } from "../models/Record.model";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/higo";

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB:", MONGODB_URI);
}

interface CSVRow {
  Column1: string;
  Number: string;
  "Name of Location": string;
  Date: string;
  "Login Hour": string;
  Name: string;
  Age: string;
  gender: string;
  Email: string;
  "No Telp": string;
  "Brand Device": string;
  "Digital Interest": string;
  "Location Type": string;
}

function parseDate(dateStr: string): Date {
  // Handle MM/DD/YYYY format
  const [month, day, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}

function transformRow(row: CSVRow) {
  return {
    number: parseInt(row.Number) || 0,
    locationName: row["Name of Location"]?.trim() || "",
    date: parseDate(row.Date),
    loginHour: row["Login Hour"]?.trim() || "",
    name: row.Name?.trim() || "",
    age: parseInt(row.Age) || 0,
    gender: row.gender?.trim() === "Female" ? "Female" : "Male",
    email: row.Email?.trim().toLowerCase() || "",
    phone: row["No Telp"]?.trim() || "",
    brandDevice: row["Brand Device"]?.trim() || "",
    digitalInterest: row["Digital Interest"]?.trim() || "",
    locationType: row["Location Type"]?.trim() || "",
  };
}

export async function importCSV(filePath: string) {
  await connectDB();

  console.log("Starting CSV import from:", filePath);

  if (!fs.existsSync(filePath)) {
    console.error("CSV file not found:", filePath);
    process.exit(1);
  }

  const batchSize = 1000;
  let batch: any[] = [];
  let totalCount = 0;
  let errorCount = 0;

  return new Promise<void>((resolve, reject) => {
    const stream = fs
      .createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim() }));

    stream.on("data", async (row: CSVRow) => {
      try {
        const transformedRow = transformRow(row);
        batch.push({ insertOne: { document: transformedRow } });

        if (batch.length >= batchSize) {
          try {
            const result = await RecordModel.bulkWrite(batch, {
              ordered: false,
            });
            totalCount += result.insertedCount || 0;
            console.log(`Imported batch: ${totalCount} total records`);
            batch = [];
          } catch (error) {
            console.error("Batch insert error:", error);
            errorCount += batch.length;
            batch = [];
          }
        }
      } catch (error) {
        console.error("Row transformation error:", error);
        errorCount++;
      }
    });

    stream.on("end", async () => {
      // Insert remaining batch
      if (batch.length > 0) {
        try {
          const result = await RecordModel.bulkWrite(batch, { ordered: false });
          totalCount += result.insertedCount || 0;
        } catch (error) {
          console.error("Final batch insert error:", error);
          errorCount += batch.length;
        }
      }

      console.log("Import completed!");
      console.log(`Total imported: ${totalCount}`);
      console.log(`Errors: ${errorCount}`);

      await mongoose.disconnect();
      resolve();
    });

    stream.on("error", (error) => {
      console.error("Stream error:", error);
      reject(error);
    });
  });
}

// Run import if called directly
if (require.main === module) {
  const csvFilePath =
    process.argv[2] ||
    path.join(__dirname, "../../data/compressed-dataset.csv");

  importCSV(csvFilePath)
    .then(() => {
      console.log("Import script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Import script failed:", error);
      process.exit(1);
    });
}
