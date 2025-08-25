"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Record_model_1 = require("../models/Record.model");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/higo";
async function quickImport() {
    console.log("Connecting to MongoDB...");
    await mongoose_1.default.connect(MONGODB_URI);
    console.log("Connected!");
    const filePath = path_1.default.join(__dirname, "../../data/compressed-dataset.csv");
    console.log("Reading file:", filePath);
    const records = [];
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
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
                const result = await Record_model_1.RecordModel.insertMany(records);
                console.log(`Successfully inserted ${result.length} records`);
            }
            catch (error) {
                console.error("Insert error:", error);
            }
        }
        await mongoose_1.default.disconnect();
    });
}
quickImport().catch(console.error);
//# sourceMappingURL=quick-import.js.map