import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Review from "@/models/Review";
import { getUser } from "@/lib/getUser";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin Reviews API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch all reviews" },
      { status: 500 }
    );
  }
}
