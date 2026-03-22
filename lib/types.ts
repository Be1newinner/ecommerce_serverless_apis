// Product Types
export interface Product {
  id: string;
  name: string;
  sku?: string;
  category: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  stock: number;
  status: "active" | "inactive" | "discontinued";
  images: string[];
  specifications?: ISpecification[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  variants?: ProductVariant[];
  fitments?: Fitment[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Fitment {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  isFeatured: boolean;
  children?: Category[];
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer Types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: "active" | "blocked" | "inactive";
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  customerId: string;
  type: "billing" | "shipping";
  isDefault: boolean;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
  internalNotes?: string;
  tracking?: {
    carrier: string;
    trackingNumber: string;
    shippedDate: Date;
    estimatedDelivery?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  method: "credit_card" | "debit_card" | "upi" | "netbanking";
  transactionId?: string;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Attribute Types
export interface Attribute {
  id: string;
  name: string;
  slug: string;
  type: "text" | "select" | "color" | "size";
  values: AttributeValue[];
  usageCount: number;
  createdAt: Date;
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  value: string;
  slug: string;
}

export interface AttributeSet {
  id: string;
  name: string;
  attributes: Attribute[];
  usageCount: number;
  createdAt: Date;
}

// Dashboard Types
export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topCategory: string;
  recentOrders: Order[];
  lowStockProducts: Product[];
  paymentStatus: {
    paid: number;
    pending: number;
    failed: number;
  };
  shipmentStatus: {
    pending: number;
    shipped: number;
    delivered: number;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "catalog_manager" | "order_manager";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Settings Types
export interface ShiprocketSettings {
  apiToken: string;
  authToken: string;
  mode: "test" | "live";
  lastTested?: Date;
  isConnected: boolean;
}

export interface CheckoutSettings {
  guestCheckoutEnabled: boolean;
  requiredFields: string[];
  freeShippingThreshold?: number;
  taxCalculationMethod: "percentage" | "fixed";
  taxRate?: number;
}
