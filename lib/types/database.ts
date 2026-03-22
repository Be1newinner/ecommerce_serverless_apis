import { ObjectId } from "mongodb";

// Users Collection
export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  password?: string;
  image?: string;
  phone?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Products Collection
export interface Product {
  _id?: ObjectId;
  sku: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  inventory: number;
  images: string[];
  specifications?: any[];
  compatibility?: string[];
  rating: number;
  reviewCount: number;
  manufacturer: string;
  warranty?: string;
  isFeatured?: boolean;
  status?: "active" | "inactive" | "discontinued";
  createdAt: Date;
  updatedAt: Date;
}

// Categories Collection
export interface Category {
  _id?: ObjectId;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  parentCategory?: ObjectId;
  createdAt: Date;
}

// Reviews Collection
export interface Review {
  _id?: ObjectId;
  productId: ObjectId;
  userId: ObjectId;
  userName?: string;
  rating: number;
  title: string;
  comment: string;
  verified?: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// Orders Collection
export interface Order {
  _id?: ObjectId;
  userId: ObjectId;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: string;
  paymentId?: string;
  billingAddress: Address;
  shippingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

// Address Type
export interface Address {
  fullName: string;
  phoneNumber: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Wishlist Collection
export interface Wishlist {
  _id?: ObjectId;
  userId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
}
