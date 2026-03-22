import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { getUser } from "@/lib/getUser";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = user.companyId;
    if (!companyId) {
      return NextResponse.json({ error: "No organization associated" }, { status: 403 });
    }

    await dbConnect();
    const orders = await Order.find({ companyId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Admin Orders API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
