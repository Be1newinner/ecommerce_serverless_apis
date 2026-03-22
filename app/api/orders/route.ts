import dbConnect from "@/lib/mongoose";
import { getUser } from "@/lib/getUser";
import { CheckoutSchema } from "@/lib/validations";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = CheckoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid checkout data", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { items, subtotal, tax, shippingCost } = body;
    if (!items || items.length === 0)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    await dbConnect();

    // Auto-cleanup any corrupted historical orders with null orderNumbers
    // This prevents E11000 duplicate key errors if previous saves failed silently
    await Order.deleteMany({ orderNumber: null });

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newOrder = new Order({
      userId: user.id,
      orderNumber,
      items: items.map((item: any) => ({
        productId: item.productId || item._id,
        productName: item.name || item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      billingAddress: validation.data.billingAddress,
      shippingAddress:
        validation.data.shippingAddress || validation.data.billingAddress,
      shippingMethod: "standard",
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: body.paymentMethod,
      subtotal,
      tax,
      shipping: shippingCost,
      total: subtotal + tax + shippingCost,
    });

    const result = await newOrder.save();

    return NextResponse.json({
      order: result,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const orders = await Order.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
