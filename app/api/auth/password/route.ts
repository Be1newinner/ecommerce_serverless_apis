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

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Select password field as it is not selected by default
    const user = await User.findById(decoded.id).select("+password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Note: ensure comparePassword method works as expected on the User instance
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid current password" },
        { status: 400 },
      );
    }

    // Set new password (the pre-save hook in User model will hash it)
    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update password" },
      { status: 500 },
    );
  }
}
