import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  category: string;
  categoryId?: mongoose.Types.ObjectId;
  images: string[];
  specifications: ISpecification[];
  stock: number;
  status: "active" | "inactive" | "discontinued";
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SpecificationSchema = new Schema<ISpecification>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    category: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    images: { type: [String], default: [] },
    specifications: { type: [SpecificationSchema], default: [] },
    stock: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive", "discontinued"],
      default: "active",
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
