import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (!TOKEN_SECURITY) {
      throw new Error("TOKEN_SECURITY is not defined in env");
    }

    const role = user.role || "user";
    const companyId = user.companyId ? user.companyId.toString() : "";

    const access_token = jwt.sign(
      { id: user._id.toString(), role, companyId, token_type: "access" },
      TOKEN_SECURITY,
      { expiresIn: "15m" },
    );

    const refresh_token = jwt.sign(
      { id: user._id.toString(), role, companyId, token_type: "refresh" },
      TOKEN_SECURITY,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
    });

    response.cookies.set({
      name: "access_token",
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set({
      name: "refresh_token",
      value: refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Check if it's a database connection timeout
    if (error.name === "MongooseServerSelectionError" || error.message.includes("selection timeout")) {
      return NextResponse.json(
        { error: "Database connection failed. Please check if your IP is whitelisted in MongoDB Atlas." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
