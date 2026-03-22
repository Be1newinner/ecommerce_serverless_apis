import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
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
    // Fetch only customers (role: user) belonging to this company
    const users = await User.find({ companyId, role: "user" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin Users API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
