import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";

export interface OrderItemUpdatePayload {
  quantity: number;
}

export interface OrderItemStatusPayload {
  status: string;
}

export const updateOrderItem = async (id: string, payload: OrderItemUpdatePayload) => {
  return axiosClient.put<ApiResponse<unknown>>(`/order-items/${id}`, payload);
};

export const deleteOrderItem = async (id: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/order-items/${id}`);
};

export const updateOrderItemStatus = async (
  id: string,
  payload: OrderItemStatusPayload
) => {
  return axiosClient.patch<ApiResponse<unknown>>(`/order-items/${id}/status`, payload);
};
