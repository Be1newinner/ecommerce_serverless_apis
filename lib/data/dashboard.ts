import type { DashboardMetrics } from "@/lib/types";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Category from "@/models/Category"; // optional
import { toPlainObject } from "@/lib/utils";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await dbConnect();

  const totalOrders = await Order.countDocuments();

  // Aggregate revenue
  const revenueResult = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const recentOrdersRaw = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  const recentOrders = recentOrdersRaw.map((o: any) => ({
    ...o,
    id: o._id.toString(),
  }));

  const lowStockProductsRaw = await Product.find({
    stock: { $lte: 10 },
  }).lean();
  const lowStockProducts = lowStockProductsRaw.map((p: any) => ({
    ...p,
    id: p._id.toString(),
  }));

  const paymentStatus = {
    paid: await Order.countDocuments({ paymentStatus: "completed" }),
    pending: await Order.countDocuments({ paymentStatus: "pending" }),
    failed: await Order.countDocuments({ paymentStatus: "failed" }),
  };

  const shipmentStatus = {
    pending: await Order.countDocuments({
      status: { $in: ["pending", "processing"] },
    }),
    shipped: await Order.countDocuments({ status: "shipped" }),
    delivered: await Order.countDocuments({ status: "delivered" }),
  };

  return toPlainObject({
    totalOrders,
    totalRevenue,
    averageOrderValue,
    topCategory: "Oils & Fluids", // Mock for now, requires complex aggregation on order items
    recentOrders,
    lowStockProducts,
    paymentStatus,
    shipmentStatus,
  });
}
