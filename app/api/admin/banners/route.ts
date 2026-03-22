import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";

export async function GET() {
  try {
    await dbConnect();
    const banners = await Banner.find().sort({ order: 1 });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Admin Banners API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const banner = await Banner.create(body);
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create banner" },
      { status: 500 }
    );
  }
}
