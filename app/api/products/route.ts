import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY || "default_secret";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, TOKEN_SECURITY) as any;
    const companyId = decoded.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "No organization associated" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    await dbConnect();

    const query: any = { companyId };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, TOKEN_SECURITY) as any;
    const companyId = decoded.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "No organization associated" }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();

    // Ensure companyId is injected
    const productData = {
      ...body,
      companyId,
      // Provide defaults for missing mandatory fields if not present
      originalPrice: body.originalPrice || body.price,
      description: body.description || body.name,
      longDescription: body.longDescription || body.description || body.name,
    };

    const product = await Product.create(productData);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
