import type { Order as OrderType } from "@/lib/types";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { toPlainObject } from "@/lib/utils";

export async function getOrders(): Promise<OrderType[]> {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return toPlainObject(
    orders.map((o: any) => ({
      ...o,
      id: o._id.toString(),
    })),
  );
}

export async function getOrderById(id: string): Promise<OrderType | null> {
  await dbConnect();
  try {
    const o = (await Order.findById(id).lean()) as any;
    if (!o) return null;
    return toPlainObject({
      ...o,
      id: o._id.toString(),
    });
  } catch (e) {
    return null;
  }
}

export async function getOrdersByStatus(status: string): Promise<OrderType[]> {
  await dbConnect();
  const orders = await Order.find({ status }).lean();
  return toPlainObject(
    orders.map((o: any) => ({
      ...o,
      id: o._id.toString(),
    })),
  );
}

export async function getOrdersByPaymentStatus(
  status: string,
): Promise<OrderType[]> {
  await dbConnect();
  const orders = await Order.find({ paymentStatus: status }).lean();
  return toPlainObject(
    orders.map((o: any) => ({
      ...o,
      id: o._id.toString(),
    })),
  );
}

export async function getOrdersByCustomer(
  customerId: string,
): Promise<OrderType[]> {
  await dbConnect();
  const orders = await Order.find({ userId: customerId }).lean();
  return toPlainObject(
    orders.map((o: any) => ({
      ...o,
      id: o._id.toString(),
    })),
  );
}

export async function searchOrders(query: string): Promise<OrderType[]> {
  await dbConnect();
  const regex = new RegExp(query, "i");
  const orders = await Order.find({
    $or: [{ orderNumber: regex }], // Adding name search is hard without aggregation or populating
  }).lean();
  return toPlainObject(
    orders.map((o: any) => ({
      ...o,
      id: o._id.toString(),
    })),
  );
}
