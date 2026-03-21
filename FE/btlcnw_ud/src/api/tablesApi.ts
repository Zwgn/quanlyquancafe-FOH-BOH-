import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { TablePayload } from "../types/table";

export const getTables = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/tables");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const createTable = async (payload: TablePayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/tables", payload);
};

export const updateTable = async (id: string, payload: TablePayload) => {
  return axiosClient.put<ApiResponse<unknown>>(`/tables/${id}`, payload);
};

export const updateTableStatus = async (id: string, status: string) => {
  return axiosClient.patch<ApiResponse<unknown>>(`/tables/${id}/status`, { status });
};
