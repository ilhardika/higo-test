"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIndexes = setupIndexes;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Record_model_1 = require("../models/Record.model");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/higo";
async function connectDB() {
    await mongoose_1.default.connect(MONGODB_URI);
    console.log("Connected to MongoDB:", MONGODB_URI);
}
async function setupIndexes() {
    await connectDB();
    console.log("Setting up database indexes...");
    try {
        // Create indexes for better query performance
        await Record_model_1.RecordModel.collection.createIndex({ number: 1 }, { unique: false });
        await Record_model_1.RecordModel.collection.createIndex({ gender: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ locationType: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ digitalInterest: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ brandDevice: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ locationName: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ date: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ createdAt: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ updatedAt: 1 });
        // Compound indexes for common queries
        await Record_model_1.RecordModel.collection.createIndex({ gender: 1, locationType: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ gender: 1, digitalInterest: 1 });
        await Record_model_1.RecordModel.collection.createIndex({ date: 1, gender: 1 });
        await Record_model_1.RecordModel.collection.createIndex({
            locationType: 1,
            digitalInterest: 1,
        });
        // Text index for search functionality
        await Record_model_1.RecordModel.collection.createIndex({
            name: "text",
            locationName: "text",
            email: "text",
            digitalInterest: "text",
        });
        console.log("✅ All indexes created successfully");
        // Display existing indexes
        const indexes = await Record_model_1.RecordModel.collection.indexes();
        console.log("Current indexes:", indexes.map((idx) => idx.name));
    }
    catch (error) {
        console.error("Error creating indexes:", error);
    }
    finally {
        await mongoose_1.default.disconnect();
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
//# sourceMappingURL=setup-indexes.js.map