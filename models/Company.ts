import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
export default Company;
