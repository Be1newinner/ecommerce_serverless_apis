import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { getUser } from "@/lib/getUser";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Admin Orders API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch all orders" },
      { status: 500 }
    );
  }
}
