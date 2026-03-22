import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECURITY as string,
    ) as any;

    await dbConnect();
    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Auth me error:", error);
    if (error.name === "MongooseServerSelectionError" || error.message.includes("selection timeout")) {
      return NextResponse.json(
        { error: "Database connection failed. Please check if your IP is whitelisted in MongoDB Atlas." },
        { status: 503 },
      );
    }
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
