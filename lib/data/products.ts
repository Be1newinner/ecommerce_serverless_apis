import type { Product as ProductType } from "@/lib/types";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { toPlainObject } from "@/lib/utils";

export interface ProductFilters {
  search?: string;
  category?: string;
  stockStatus?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: ProductType[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedProducts> {
  await dbConnect();

  const query: any = {};

  if (filters.search) {
    const regex = new RegExp(filters.search, "i");
    query.$or = [{ name: regex }, { sku: regex }];
  }

  if (filters.category && filters.category !== "all") {
    query.category = filters.category;
  }

  if (filters.stockStatus && filters.stockStatus !== "all") {
    if (filters.stockStatus === "in-stock") {
      query.stock = { $gt: 10 };
    } else if (filters.stockStatus === "low-stock") {
      query.stock = { $lte: 10, $gt: 0 };
    } else if (filters.stockStatus === "out-of-stock") {
      query.stock = 0;
    }
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products: toPlainObject(
      products.map((p: any) => ({
        ...p,
        id: p._id.toString(),
      })),
    ),
    total,
    totalPages,
    currentPage: page,
  };
}

export async function getProductById(id: string): Promise<ProductType | null> {
  await dbConnect();
  try {
    const p = (await Product.findById(id).lean()) as any;
    if (!p) return null;
    return toPlainObject({
      ...p,
      id: p._id.toString(),
    });
  } catch (e) {
    return null;
  }
}

export async function searchProducts(query: string): Promise<ProductType[]> {
  await dbConnect();
  const regex = new RegExp(query, "i");
  const products = await Product.find({
    $or: [{ name: regex }, { slug: regex }],
  }).lean();
  return toPlainObject(
    products.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    })),
  );
}

export async function getProductsByCategory(
  category: string,
): Promise<ProductType[]> {
  await dbConnect();
  const products = await Product.find({ category }).lean();
  return toPlainObject(
    products.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    })),
  );
}

export async function getLowStockProducts(
  threshold: number = 10,
): Promise<ProductType[]> {
  await dbConnect();
  const products = await Product.find({
    stock: { $lte: threshold, $gt: 0 },
  }).lean();
  return toPlainObject(
    products.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    })),
  );
}

export async function getOutOfStockProducts(): Promise<ProductType[]> {
  await dbConnect();
  const products = await Product.find({ stock: 0 }).lean();
  return toPlainObject(
    products.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    })),
  );
}
