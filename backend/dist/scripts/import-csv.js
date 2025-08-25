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
async function connectDB() {
    await mongoose_1.default.connect(MONGODB_URI);
    console.log("Connected to MongoDB:", MONGODB_URI);
}
function parseDate(dateStr) {
    // Handle MM/DD/YYYY format
    const [month, day, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
}
function transformRow(row) {
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
async function importCSV(filePath) {
    await connectDB();
    console.log("Starting CSV import from:", filePath);
    if (!fs_1.default.existsSync(filePath)) {
        console.error("CSV file not found:", filePath);
        process.exit(1);
    }
    const batchSize = 1000;
    let batch = [];
    let totalCount = 0;
    let errorCount = 0;
    return new Promise((resolve, reject) => {
        const stream = fs_1.default
            .createReadStream(filePath)
            .pipe((0, csv_parser_1.default)({ mapHeaders: ({ header }) => header.trim() }));
        stream.on("data", async (row) => {
            try {
                const transformedRow = transformRow(row);
                batch.push({ insertOne: { document: transformedRow } });
                if (batch.length >= batchSize) {
                    try {
                        const result = await Record_model_1.RecordModel.bulkWrite(batch, {
                            ordered: false,
                        });
                        totalCount += result.insertedCount || 0;
                        console.log(`Imported batch: ${totalCount} total records`);
                        batch = [];
                    }
                    catch (error) {
                        console.error("Batch insert error:", error);
                        errorCount += batch.length;
                        batch = [];
                    }
                }
            }
            catch (error) {
                console.error("Row transformation error:", error);
                errorCount++;
            }
        });
        stream.on("end", async () => {
            // Insert remaining batch
            if (batch.length > 0) {
                try {
                    const result = await Record_model_1.RecordModel.bulkWrite(batch, { ordered: false });
                    totalCount += result.insertedCount || 0;
                }
                catch (error) {
                    console.error("Final batch insert error:", error);
                    errorCount += batch.length;
                }
            }
            console.log("Import completed!");
            console.log(`Total imported: ${totalCount}`);
            console.log(`Errors: ${errorCount}`);
            await mongoose_1.default.disconnect();
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
    const csvFilePath = process.argv[2] ||
        path_1.default.join(__dirname, "../../data/compressed-dataset.csv");
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
//# sourceMappingURL=import-csv.js.map