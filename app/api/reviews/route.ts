import { getUser } from "@/lib/getUser";
import dbConnect from "@/lib/mongoose";
import { ReviewSchema } from "@/lib/validations";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate
    const validation = ReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { productId } = body;
    const { rating, title, comment } = validation.data;

    await dbConnect();

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: user.id,
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.title = title;
      existingReview.comment = comment;
      await existingReview.save();
    } else {
      // Create new review
      await Review.create({
        productId,
        userId: user.id,
        userName: "Verified Customer", // Using static string as name isn't in token
        rating,
        title,
        comment,
        helpful: 0,
      });
    }

    // Update product rating
    const reviews = await Review.find({ productId }).lean();

    // In strict TypeScript, we must assert review type or use any
    const avgRating =
      reviews.reduce((sum, r: any) => sum + r.rating, 0) / reviews.length;

    product.rating = Math.round(avgRating * 10) / 10;
    product.reviewCount = reviews.length;

    await product.save();

    return NextResponse.json({
      message: "Review created successfully",
    });
  } catch (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
