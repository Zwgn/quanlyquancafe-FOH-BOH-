import { OrderListItem } from "../types/order";

const normalizeDate = (value: unknown): string => {
  if (!value) {
    return "-";
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("vi-VN");
};

const normalizeNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

export const mapOrder = (input: unknown, index: number): OrderListItem => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.orderId ?? row.OrderId ?? index),
    tableId: String(row.tableId ?? row.TableId ?? "-"),
    employeeId: String(row.employeeId ?? row.EmployeeId ?? "-"),
    status: String(row.status ?? row.Status ?? "Pending"),
    createdAt: normalizeDate(row.createdAt ?? row.CreatedAt),
    totalAmount: 0
  };
};

export const mergePaymentIntoOrders = (
  orders: OrderListItem[],
  payments: unknown[]
): OrderListItem[] => {
  const paymentByOrderId = new Map<string, { amount: number; paidAt: string }>();

  for (const item of payments) {
    const row = (item ?? {}) as Record<string, unknown>;
    const orderId = String(row.orderId ?? row.OrderId ?? "");

    if (!orderId) {
      continue;
    }

    paymentByOrderId.set(orderId, {
      amount: normalizeNumber(row.amount ?? row.Amount),
      paidAt: normalizeDate(row.paidAt ?? row.PaidAt)
    });
  }

  return orders.map((order) => {
    const payment = paymentByOrderId.get(order.id);

    if (!payment) {
      return order;
    }

    return {
      ...order,
      totalAmount: payment.amount,
      paidAt: payment.paidAt
    };
  });
};

export const getOrderStatusLabel = (status: string): string => {
  const normalized = status.toLowerCase();

  if (normalized === "pending" || normalized === "open") {
    return "Chờ xử lý";
  }

  if (normalized === "preparing") {
    return "Đang chuẩn bị";
  }

  if (normalized === "ready") {
    return "Sẵn sàng";
  }

  if (normalized === "completed" || normalized === "paid") {
    return "Đã thanh toán";
  }

  if (normalized === "served") {
    return "Đã phục vụ";
  }

  if (normalized === "cancelled") {
    return "Đã hủy";
  }

  return status;
};

export const isPaidOrder = (status: string): boolean => {
  const normalized = status.toLowerCase();
  return normalized === "completed" || normalized === "paid";
};
