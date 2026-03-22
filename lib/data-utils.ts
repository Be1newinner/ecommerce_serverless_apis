import dbConnect from "@/lib/mongoose";
import Product, { IProduct } from "@/models/Product";
import Review, { IReview } from "@/models/Review";
import { ProductFilter } from "@/lib/validations";
import { CATEGORIES } from "./dummy-data";

function serialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export async function getAllProducts(filter?: Partial<ProductFilter>) {
  await dbConnect();

  let query: any = {};

  if (filter?.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { description: { $regex: filter.search, $options: "i" } },
    ];
  }

  if (filter?.category) {
    query.category = filter.category;
  }

  if (filter?.minPrice || filter?.maxPrice) {
    query.price = {};
    if (filter.minPrice) query.price.$gte = filter.minPrice;
    if (filter.maxPrice) query.price.$lte = filter.maxPrice;
  }

  if (filter?.rating) {
    query.rating = { $gte: filter.rating };
  }

  let sortOption: any = {};
  if (filter?.sort) {
    switch (filter.sort) {
      case "priceLow":
        sortOption.price = 1;
        break;
      case "priceHigh":
        sortOption.price = -1;
        break;
      case "rating":
        sortOption.rating = -1;
        break;
      case "newest":
        sortOption.createdAt = -1;
        break;
    }
  } else {
    sortOption.createdAt = -1;
  }

  const page = filter?.page || 1;
  const limit = filter?.limit || 12;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  return serialize({
    products,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
}

export async function getProductById(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();
    return serialize(product);
  } catch (error) {
    return null;
  }
}

export async function getFeaturedProducts(limit: number = 4) {
  await dbConnect();
  const products = await Product.find({ isFeatured: true }).limit(limit).lean();
  return serialize(products);
}

export async function getProductsByCategory(category: string, limit?: number) {
  await dbConnect();
  let query = Product.find({ category });
  if (limit) {
    query = query.limit(limit);
  }
  const products = await query.lean();
  return serialize(products);
}

export async function getRelatedProducts(productId: string, limit: number = 4) {
  await dbConnect();
  const product = (await Product.findById(productId).lean()) as IProduct;
  if (!product) return [];

  const products = await Product.find({
    category: product.category,
    _id: { $ne: productId },
  })
    .limit(limit)
    .lean();

  return serialize(products);
}

export function getAllCategories() {
  return CATEGORIES;
}

export async function getProductReviews(productId: string) {
  await dbConnect();
  const reviews = await Review.find({ productId })
    .sort({ createdAt: -1 })
    .lean();
  return serialize(reviews);
}

export async function calculateProductRating(productId: string) {
  await dbConnect();
  const reviews = (await Review.find({ productId }).lean()) as IReview[];
  if (reviews.length === 0) return { rating: 0, count: 0 };

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return {
    rating: Math.round(avgRating * 10) / 10,
    count: reviews.length,
  };
}

export async function getPriceRange() {
  await dbConnect();
  const [minProduct, maxProduct] = await Promise.all([
    Product.findOne().sort({ price: 1 }).lean() as Promise<IProduct | null>,
    Product.findOne().sort({ price: -1 }).lean() as Promise<IProduct | null>,
  ]);

  return {
    min: minProduct ? minProduct.price : 0,
    max: maxProduct ? maxProduct.price : 1000,
  };
}
