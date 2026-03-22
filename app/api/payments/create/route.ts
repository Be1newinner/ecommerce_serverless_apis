import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, amount, description } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Verify order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId: user.id,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // TODO: Integrate with Instamojo API

    const paymentLink = {
      short_link: `https://instamojo.com/test-link-${orderId}`,
      payment_id: `PAYMENT-${Date.now()}`,
      orderId,
      status: "pending",
      amount,
    };

    // Update order with payment ID
    order.paymentId = paymentLink.payment_id;
    await order.save();

    return NextResponse.json({
      success: true,
      paymentLink: paymentLink.short_link,
      paymentId: paymentLink.payment_id,
    });
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
