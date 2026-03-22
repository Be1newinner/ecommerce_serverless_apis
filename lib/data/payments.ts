import type { Payment } from "@/lib/types";

export const mockPayments: Payment[] = [];

export async function getPayments(): Promise<Payment[]> {
  return mockPayments;
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  return mockPayments.find((p) => p.id === id) || null;
}

export async function getPaymentsByStatus(status: string): Promise<Payment[]> {
  return mockPayments.filter((p) => p.status === status);
}

export async function getPaymentsByOrder(
  orderId: string,
): Promise<Payment | null> {
  return mockPayments.find((p) => p.orderId === orderId) || null;
}
