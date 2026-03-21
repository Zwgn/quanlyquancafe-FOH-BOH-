import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";

export const getDailyRevenueReport = async (date: string) => {
  const response = await axiosClient.get<ApiResponse<unknown>>("/reports/daily-revenue", {
    params: { date }
  });
  return response.data?.data;
};

export const getBestSellingItemsReport = async (top: number) => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>(
    "/reports/best-selling-items",
    { params: { top } }
  );
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const getLowStockIngredientsReport = async (threshold: number) => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>(
    "/reports/low-stock-ingredients",
    { params: { threshold } }
  );
  return Array.isArray(response.data?.data) ? response.data.data : [];
};
