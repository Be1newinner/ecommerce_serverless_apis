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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECURITY as string) as {
      id: string;
    };

    await dbConnect();
    const user = await User.findById(decoded.id).select("addresses").lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error: any) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json(
      { message: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECURITY as string) as {
      id: string;
    };

    const address = await request.json();

    // Basic validation
    if (
      !address.fullName ||
      !address.phoneNumber ||
      !address.streetAddress ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.country
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.addresses.push(address);
    await user.save();

    return NextResponse.json(
      {
        message: "Address added successfully",
        addresses: user.addresses,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Add address error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to add address" },
      { status: 500 },
    );
  }
}
