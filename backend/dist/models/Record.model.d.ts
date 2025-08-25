import mongoose, { Document } from "mongoose";
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
export declare const RecordModel: mongoose.Model<IRecord, {}, {}, {}, mongoose.Document<unknown, {}, IRecord, {}, {}> & IRecord & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Record.model.d.ts.map