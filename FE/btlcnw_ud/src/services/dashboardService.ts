import {
  fetchDailyRevenue,
  fetchEmployees,
  fetchMenuItems,
  fetchOrders
} from "../api/dashboardApi";
import { DashboardStats } from "../types/dashboard";

const extractArray = (value: unknown): unknown[] => {
  return Array.isArray(value) ? value : [];
};

const extractRevenue = (value: unknown): number => {
  if (!value || typeof value !== "object") {
    return 0;
  }

  const record = value as Record<string, unknown>;
  const candidates = [
    record.totalRevenue,
    record.TotalRevenue,
    record.revenue,
    record.Revenue,
    record.total,
    record.Total,
    record.amount,
    record.Amount
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }

  return 0;
};

const getToday = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [revenueResult, ordersResult, menuItemsResult, employeesResult] =
    await Promise.allSettled([
      fetchDailyRevenue(getToday()),
      fetchOrders(),
      fetchMenuItems(),
      fetchEmployees()
    ]);

  const totalRevenue =
    revenueResult.status === "fulfilled"
      ? extractRevenue(revenueResult.value.data?.data)
      : 0;

  const totalOrders =
    ordersResult.status === "fulfilled"
      ? extractArray(ordersResult.value.data?.data).length
      : 0;

  const totalProducts =
    menuItemsResult.status === "fulfilled"
      ? extractArray(menuItemsResult.value.data?.data).length
      : 0;

  const activeEmployees =
    employeesResult.status === "fulfilled"
      ? extractArray(employeesResult.value.data?.data).length
      : 0;

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    activeEmployees
  };
};
