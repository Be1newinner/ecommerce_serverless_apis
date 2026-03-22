import dbConnect from "@/lib/mongoose";
import { getUser } from "@/lib/getUser";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUser();
    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await dbConnect();

    const order = await Order.findOne({ _id: id, userId: user.id }).lean();
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUser();
    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    await dbConnect();

    const order = await Order.findOne({ _id: id, userId: user.id });
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (body.status === "cancelled" && order.status !== "pending") {
      return NextResponse.json(
        { error: "Can only cancel pending orders" },
        { status: 400 },
      );
    }

    order.status = body.status;
    await order.save();

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
