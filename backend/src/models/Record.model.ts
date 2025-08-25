import mongoose, { Document, Schema } from "mongoose";

export interface IRecord extends Document {
  number: number;
  locationName: string;
  date: Date;
  loginHour: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  email: string;
  phone: string;
  brandDevice: string;
  digitalInterest: string;
  locationType: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecordSchema = new Schema<IRecord>(
  {
    number: {
      type: Number,
      required: true,
      index: true,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    loginHour: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 150,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    brandDevice: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    digitalInterest: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    locationType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "records",
  }
);

// Text index untuk search functionality
RecordSchema.index({
  name: "text",
  locationName: "text",
  email: "text",
  digitalInterest: "text",
});

// Compound indexes untuk query yang sering digunakan
RecordSchema.index({ gender: 1, locationType: 1 });
RecordSchema.index({ date: 1, gender: 1 });
RecordSchema.index({ digitalInterest: 1, gender: 1 });

export const RecordModel = mongoose.model<IRecord>("Record", RecordSchema);
