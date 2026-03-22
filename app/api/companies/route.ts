import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Company from "@/models/Company";

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
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return NextResponse.json(
        { error: "Company already exists" },
        { status: 409 }
      );
    }

    const newCompany = new Company({ name });
    await newCompany.save();

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
