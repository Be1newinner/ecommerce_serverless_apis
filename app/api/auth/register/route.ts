import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    const user = new User({
      name,
      email,
      password,
      role: "user",
    });

    await user.save();

    if (!TOKEN_SECURITY) {
      throw new Error("TOKEN_SECURITY is not defined");
    }

    const access_token = jwt.sign(
      { id: user._id.toString(), role: user.role, token_type: "access" },
      TOKEN_SECURITY,
      { expiresIn: "15m" },
    );

    const refresh_token = jwt.sign(
      { id: user._id.toString(), role: user.role, token_type: "refresh" },
      TOKEN_SECURITY,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({
      message: "Registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
