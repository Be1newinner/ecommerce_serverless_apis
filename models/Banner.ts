import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle: string;
  url: string;
  alt: string;
  transparent: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String, required: true },
    transparent: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
