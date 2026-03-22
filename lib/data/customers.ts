import type { Customer as CustomerType } from "@/lib/types";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import { toPlainObject } from "@/lib/utils";

export async function getCustomers(): Promise<CustomerType[]> {
  await dbConnect();
  const users = await User.find({ role: "user" }).lean();

  // To avoid n+1, we could aggregate, but for now map sequentially or return basic info
  return toPlainObject(
    users.map((u: any) => ({
      ...u,
      id: u._id.toString(),
      firstName: u.name.split(" ")[0],
      lastName: u.name.split(" ").slice(1).join(" "),
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
    })),
  );
}

export async function getCustomerById(
  id: string,
): Promise<CustomerType | null> {
  await dbConnect();
  try {
    const u = (await User.findById(id).lean()) as any;
    if (!u) return null;
    return toPlainObject({
      ...u,
      id: u._id.toString(),
      firstName: u.name.split(" ")[0],
      lastName: u.name.split(" ").slice(1).join(" "),
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
    });
  } catch (e) {
    return null;
  }
}

export async function getCustomersByStatus(
  status: string,
): Promise<CustomerType[]> {
  // Not implemented in DB yet as we don't have block status
  return [];
}

export async function searchCustomers(query: string): Promise<CustomerType[]> {
  await dbConnect();
  const regex = new RegExp(query, "i");
  const users = await User.find({
    role: "user",
    $or: [{ name: regex }, { email: regex }],
  }).lean();
  return toPlainObject(
    users.map((u: any) => ({
      ...u,
      id: u._id.toString(),
      firstName: u.name.split(" ")[0],
      lastName: u.name.split(" ").slice(1).join(" "),
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
    })),
  );
}

export async function getTopCustomers(
  limit: number = 5,
): Promise<CustomerType[]> {
  await dbConnect();
  const users = await User.find({ role: "user" }).limit(limit).lean();
  return toPlainObject(
    users.map((u: any) => ({
      ...u,
      id: u._id.toString(),
      firstName: u.name.split(" ")[0],
      lastName: u.name.split(" ").slice(1).join(" "),
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
    })),
  );
}
