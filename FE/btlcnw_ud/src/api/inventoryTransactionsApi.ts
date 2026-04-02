import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";

export const getInventoryTransactions = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/inventory-transactions");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};
