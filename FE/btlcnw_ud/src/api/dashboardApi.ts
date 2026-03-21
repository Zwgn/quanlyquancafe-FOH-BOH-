import axiosClient from "./axiosClient";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const fetchDailyRevenue = async (date: string) => {
  return axiosClient.get<ApiResponse<Record<string, unknown>>>(
    "/reports/daily-revenue",
    {
      params: { date }
    }
  );
};

export const fetchOrders = async () => {
  return axiosClient.get<ApiResponse<unknown[]>>("/orders");
};

export const fetchMenuItems = async () => {
  return axiosClient.get<ApiResponse<unknown[]>>("/menu-items");
};

export const fetchEmployees = async () => {
  return axiosClient.get<ApiResponse<unknown[]>>("/employees");
};
