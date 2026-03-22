import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Company from "@/models/Company";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY || "default_secret";

export async function GET() {
  try {
    await dbConnect();
    const companies = await Company.find().sort({ name: 1 });
    return NextResponse.json({ companies });
  } catch (error: any) {
    console.error("Failed to fetch companies:", error);
    if (error.name === "MongooseServerSelectionError" || error.message.includes("selection timeout")) {
      return NextResponse.json(
        { error: "Database connection failed. Please check if your IP is whitelisted in MongoDB Atlas." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, TOKEN_SECURITY) as any;
    const body = await req.json();
    const { companyId, companyName } = body;

    await dbConnect();

    // Check if user already has a company
    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existingUser.companyId) {
      return NextResponse.json(
        { error: "User is already associated with an organization" },
        { status: 400 }
      );
    }

    let finalCompanyId = companyId;

    if (!finalCompanyId && companyName) {
      // Create new company
      const newCompany = new Company({ name: companyName });
      await newCompany.save();
      finalCompanyId = newCompany._id;
    }

    if (!finalCompanyId) {
      return NextResponse.json({ error: "Company ID or Name is required" }, { status: 400 });
    }

    // Update user and promote to admin
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { companyId: finalCompanyId, role: "admin" },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new tokens with companyId included
    const access_token = jwt.sign(
      { id: user._id.toString(), role: user.role, companyId: finalCompanyId.toString(), token_type: "access" },
      TOKEN_SECURITY,
      { expiresIn: "15m" }
    );

    const refresh_token = jwt.sign(
      { id: user._id.toString(), role: user.role, companyId: finalCompanyId.toString(), token_type: "refresh" },
      TOKEN_SECURITY,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Onboarding successful",
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
      maxAge: 15 * 60,
    });

    response.cookies.set({
      name: "refresh_token",
      value: refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Onboarding error:", error);
    if (error.name === "MongooseServerSelectionError" || error.message.includes("selection timeout")) {
      return NextResponse.json(
        { error: "Database connection failed. Please check if your IP is whitelisted in MongoDB Atlas." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: error.message || "Onboarding failed" }, { status: 500 });
  }
}
