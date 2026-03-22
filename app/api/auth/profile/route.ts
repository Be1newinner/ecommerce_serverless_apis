import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECURITY as string) as {
      id: string;
    };

    const body = await request.json();
    const { name, phone, image } = body;

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        $set: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(image && { image }),
        },
      },
      { new: true },
    )
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully", user });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile" },
      { status: 500 },
    );
  }
}
