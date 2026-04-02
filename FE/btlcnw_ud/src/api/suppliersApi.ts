import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";

export interface SupplierPayload {
  name: string;
  phone: string;
  address: string;
}

export const getSuppliers = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/suppliers");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const createSupplier = async (payload: SupplierPayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/suppliers", payload);
};

export const updateSupplier = async (id: string, payload: SupplierPayload) => {
  return axiosClient.put<ApiResponse<unknown>>(`/suppliers/${id}`, payload);
};

export const deleteSupplier = async (id: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/suppliers/${id}`);
};
