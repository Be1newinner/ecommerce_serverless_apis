import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Company from "@/models/Company";
import jwt from "jsonwebtoken";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, companyName, domain } = body;

    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    // 2. Check if company name or domain exists
    const existingCompany = await Company.findOne({ 
      $or: [
        { name: companyName },
        ...(domain ? [{ domain }] : [])
      ] 
    });
    
    if (existingCompany) {
      return NextResponse.json(
        { error: "Company name or domain already exists" },
        { status: 400 }
      );
    }

    // 3. Create Company
    const company = await Company.create({
      name: companyName,
      domain: domain || undefined
    });

    // 4. Create User linked to the company
    const user = new User({
      name,
      email,
      password,
      role: "admin", // Registrant becomes admin of their company
      companyId: company._id
    });

    await user.save();

    if (!TOKEN_SECURITY) {
      throw new Error("TOKEN_SECURITY is not defined");
    }

    // 5. Generate tokens with companyId included
    const access_token = jwt.sign(
      { 
        id: user._id.toString(), 
        role: user.role, 
        companyId: company._id.toString(), 
        token_type: "access" 
      },
      TOKEN_SECURITY,
      { expiresIn: "15m" },
    );

    const refresh_token = jwt.sign(
      { 
        id: user._id.toString(), 
        role: user.role, 
        companyId: company._id.toString(), 
        token_type: "refresh" 
      },
      TOKEN_SECURITY,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({
      message: "Registered successfully",
      companyId: company._id,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: company._id
      },
    });

    // 6. Set Cookies
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
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
