import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getUser } from "@/lib/getUser";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin Users API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch all users" },
      { status: 500 }
    );
  }
}
