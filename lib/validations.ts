import { z } from "zod";

// Auth Schemas
export const SignUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof SignInSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Product Schemas
export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  rating: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(12),
  sort: z.enum(["newest", "priceLow", "priceHigh", "rating"]).optional(),
});

export type ProductFilter = z.infer<typeof ProductFilterSchema>;

// Review Schema
export const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100),
  comment: z.string().min(10).max(1000),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;

// Address Schema
export const AddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^[0-9]{6}$/, "Invalid postal code"),
  country: z.string().default("India"),
});

export type AddressInput = z.infer<typeof AddressSchema>;

// Checkout Schema
export const CheckoutSchema = z.object({
  billingAddress: AddressSchema,
  shippingAddress: AddressSchema.optional(),
  sameAsShipping: z.boolean().default(false),
  paymentMethod: z.enum([
    "credit_card",
    "debit_card",
    "upi",
    "net_banking",
    "instamojo",
    "cod",
  ]),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
