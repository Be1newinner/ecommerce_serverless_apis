import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";
import { getUser } from "@/lib/getUser";

export async function GET() {
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
    const banners = await Banner.find({ companyId }).sort({ order: 1 });
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
    const user = await getUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = user.companyId;
    if (!companyId) {
      return NextResponse.json({ error: "No organization associated" }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Inject companyId
    const banner = await Banner.create({
      ...body,
      companyId
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create banner" },
      { status: 500 }
    );
  }
}
