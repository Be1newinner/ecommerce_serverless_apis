import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status, orderId } = body;

    if (!paymentId || !status || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let paymentStatus = "failed";
    let orderStatus = "pending";

    if (status === "completed" || status === "success") {
      paymentStatus = "completed";
      orderStatus = "processing";
    } else if (status === "failed") {
      paymentStatus = "failed";
      orderStatus = "pending";
    }

    order.paymentStatus = paymentStatus as any;
    order.status = orderStatus as any;

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Payment verified",
      paymentStatus,
      orderStatus,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
