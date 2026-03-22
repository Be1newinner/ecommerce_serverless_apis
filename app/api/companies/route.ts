import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Company from "@/models/Company";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY || "default_secret";

export async function GET() {
  try {
    await dbConnect();
    const companies = await Company.find().sort({ name: 1 });
    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.error("GET companies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, TOKEN_SECURITY) as any;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already has a company
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.companyId) {
      return NextResponse.json(
        { error: "You are already associated with an organization. You cannot create another one." },
        { status: 400 }
      );
    }

    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return NextResponse.json(
        { error: "Company already exists" },
        { status: 409 }
      );
    }

    const newCompany = new Company({ name });
    await newCompany.save();
    
    // Also link the user to this new company immediately
    user.companyId = newCompany._id;
    user.role = "admin";
    await user.save();

    return NextResponse.json(
      { message: "Company created successfully", company: newCompany },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST company error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
