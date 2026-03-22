import { SignUpSchema } from "@/lib/validations";
import User from "@/models/User";
import dbConnect from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = SignUpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, name, password, companyId } = validation.data;

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // Create new user (password is hashed in pre-save hook)
    const newUser = new User({
      email,
      name,
      password,
      companyId,
      role: "user",
    });

    const result = await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result._id,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup error:", error);
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
