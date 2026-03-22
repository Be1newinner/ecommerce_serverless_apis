import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Review from "@/models/Review";
import { getUser } from "@/lib/getUser";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = user.companyId;
    if (!companyId) {
      return NextResponse.json({ error: "No organization associated" }, { status: 403 });
    }

    await dbConnect();
    const reviews = await Review.find({ companyId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin Reviews API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
