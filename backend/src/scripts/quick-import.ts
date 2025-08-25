import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { RecordModel } from "../models/Record.model";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/higo";

async function quickImport() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  const filePath = path.join(__dirname, "../../data/compressed-dataset.csv");
  console.log("Reading file:", filePath);

  const records: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      console.log("Raw row:", data);

      // Transform sesuai model
      const record = {
        number: parseInt(data.Number) || 0,
        locationName: data["Name of Location"] || "",
        date: new Date(data.Date),
        loginHour: data["Login Hour"] || "",
        name: data.Name || "",
        age: 2023 - (parseInt(data.Age) || 2000), // Convert birth year to age
        gender: data.gender === "Female" ? "Female" : "Male",
        email: data.Email || "",
        phone: data["No Telp"] || "",
        brandDevice: data["Brand Device"] || "",
        digitalInterest: data["Digital Interest"] || "",
        locationType: data["Location Type"] || "",
      };

      console.log("Transformed record:", record);
      records.push(record);
    })
    .on("end", async () => {
      console.log(`\nTotal records to insert: ${records.length}`);

      if (records.length > 0) {
        try {
          const result = await RecordModel.insertMany(records);
          console.log(`Successfully inserted ${result.length} records`);
        } catch (error) {
          console.error("Insert error:", error);
        }
      }

      await mongoose.disconnect();
    });
}

quickImport().catch(console.error);
