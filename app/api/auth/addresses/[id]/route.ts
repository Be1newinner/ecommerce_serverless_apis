import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: addressId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECURITY as string) as {
      id: string;
    };

    const updateData = await request.json();

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === addressId,
    );

    if (addressIndex === -1) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 },
      );
    }

    // Update the specific address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...updateData,
    };

    await user.save();

    return NextResponse.json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update address" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: addressId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECURITY as string) as {
      id: string;
    };

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const initialLength = user.addresses.length;
    user.addresses = user.addresses.filter(
      (addr: any) => addr._id.toString() !== addressId,
    );

    if (user.addresses.length === initialLength) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 },
      );
    }

    await user.save();

    return NextResponse.json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete address" },
      { status: 500 },
    );
  }
}
