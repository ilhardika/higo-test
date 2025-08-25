"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCSV = importCSV;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Record_model_1 = require("../models/Record.model");
// Load environment variables
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/higo";
const BATCH_SIZE = 1000; // Process in batches of 1000 records
const CSV_FILE_PATH = path_1.default.join(process.cwd(), "data", "Dataset.csv");
async function connectDB() {
    await mongoose_1.default.connect(MONGODB_URI);
    console.log("Connected to MongoDB:", MONGODB_URI);
}
function parseDate(dateStr) {
    // Handle MM/DD/YYYY format
    const [month, day, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
}
function calculateAge(birthYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}
function transformRow(row) {
    const birthYear = parseInt(row.Age) || 0;
    const currentAge = birthYear > 1900 ? calculateAge(birthYear) : birthYear;
    return {
        number: parseInt(row.Number) || 0,
        locationName: row["Name of Location"]?.trim() || "",
        date: parseDate(row.Date),
        loginHour: row["Login Hour"]?.trim() || "",
        name: row.Name?.trim() || "",
        age: currentAge,
        gender: row.gender?.trim() === "Female" ? "Female" : "Male",
        email: row.Email?.trim().toLowerCase() || "",
        phone: row["No Telp"]?.trim() || "",
        brandDevice: row["Brand Device"]?.trim() || "",
        digitalInterest: row["Digital Interest"]?.trim() || "",
        locationType: row["Location Type"]?.trim() || "",
    };
}
async function importCSV() {
    try {
        console.log("🚀 Starting full dataset import...");
        console.log(`📄 Reading from: ${CSV_FILE_PATH}`);
        if (!fs_1.default.existsSync(CSV_FILE_PATH)) {
            throw new Error(`CSV file not found: ${CSV_FILE_PATH}`);
        }
        await connectDB();
        // Clear existing data
        console.log("🗑️  Clearing existing records...");
        await Record_model_1.RecordModel.deleteMany({});
        console.log("✅ Existing records cleared");
        let batch = [];
        let totalProcessed = 0;
        let totalErrors = 0;
        const startTime = Date.now();
        console.log("📊 Processing records...");
        return new Promise((resolve, reject) => {
            const stream = fs_1.default.createReadStream(CSV_FILE_PATH)
                .pipe((0, csv_parser_1.default)())
                .on('data', async (row) => {
                try {
                    const transformedRow = transformRow(row);
                    batch.push(transformedRow);
                    // Process batch when it reaches BATCH_SIZE
                    if (batch.length >= BATCH_SIZE) {
                        stream.pause(); // Pause stream while processing
                        try {
                            await Record_model_1.RecordModel.insertMany(batch, { ordered: false });
                            totalProcessed += batch.length;
                            // Log progress every 10k records
                            if (totalProcessed % 10000 === 0) {
                                const elapsed = (Date.now() - startTime) / 1000;
                                const rate = Math.round(totalProcessed / elapsed);
                                console.log(`📈 Processed: ${totalProcessed.toLocaleString()} records (${rate}/sec)`);
                            }
                            batch = []; // Clear batch
                            stream.resume(); // Resume stream
                        }
                        catch (error) {
                            console.error("❌ Batch insert error:", error);
                            totalErrors++;
                            batch = []; // Clear batch even on error
                            stream.resume();
                        }
                    }
                }
                catch (error) {
                    totalErrors++;
                    console.error("❌ Row transformation error:", error);
                }
            })
                .on('end', async () => {
                try {
                    // Process remaining records in batch
                    if (batch.length > 0) {
                        await Record_model_1.RecordModel.insertMany(batch, { ordered: false });
                        totalProcessed += batch.length;
                    }
                    const endTime = Date.now();
                    const duration = (endTime - startTime) / 1000;
                    const rate = Math.round(totalProcessed / duration);
                    console.log("\n🎉 Import completed!");
                    console.log(`📊 Total processed: ${totalProcessed.toLocaleString()} records`);
                    console.log(`⚠️  Total errors: ${totalErrors}`);
                    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
                    console.log(`🚀 Average rate: ${rate} records/second`);
                    // Verify count in database
                    const dbCount = await Record_model_1.RecordModel.countDocuments();
                    console.log(`✅ Records in database: ${dbCount.toLocaleString()}`);
                    resolve();
                }
                catch (error) {
                    console.error("❌ Final batch error:", error);
                    reject(error);
                }
            })
                .on('error', (error) => {
                console.error("❌ Stream error:", error);
                reject(error);
            });
        });
    }
    catch (error) {
        console.error("❌ Import failed:", error);
        throw error;
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log("🔌 Database connection closed");
    }
}
// Run import if called directly
if (require.main === module) {
    importCSV()
        .then(() => {
        console.log("✅ Import script completed successfully");
        process.exit(0);
    })
        .catch((error) => {
        console.error("❌ Import script failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=import-full-dataset.js.map