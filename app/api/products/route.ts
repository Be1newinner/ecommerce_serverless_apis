import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/data-utils";
import { ProductFilter } from "@/lib/validations";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filter: Partial<ProductFilter> = {
      page: Math.max(1, parseInt(searchParams.get("page") || "1")),
      limit: Math.min(100, parseInt(searchParams.get("limit") || "12")),
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!)
        : undefined,
      sort: (searchParams.get("sort") as any) || "newest",
    };

    // Remove undefined values
    Object.keys(filter).forEach(
      (key) =>
        filter[key as keyof ProductFilter] === undefined &&
        delete filter[key as keyof ProductFilter],
    );

    const result = await getAllProducts(filter);

    return NextResponse.json({
      products: result.products,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const product = await Product.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 },
    );
  }
}
