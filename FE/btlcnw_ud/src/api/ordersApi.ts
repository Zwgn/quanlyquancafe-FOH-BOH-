import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { OrderItemPayload, OrderPayload, OrderStatusPayload } from "../types/order";

export const getOrders = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/orders");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const getOrderById = async (orderId: string) => {
  const response = await axiosClient.get<ApiResponse<unknown>>(`/orders/${orderId}`);
  return response.data?.data ?? null;
};

export const createOrder = async (payload: OrderPayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/orders", payload);
};

export const updateOrderStatus = async (
  orderId: string,
  payload: OrderStatusPayload
) => {
  return axiosClient.patch<ApiResponse<unknown>>(`/orders/${orderId}/status`, payload);
};

export const deleteOrder = async (orderId: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/orders/${orderId}`);
};

export const addOrderItem = async (orderId: string, payload: OrderItemPayload) => {
  return axiosClient.post<ApiResponse<unknown>>(`/orders/${orderId}/items`, payload);
};

export const checkoutOrder = async (orderId: string, paymentMethod: string) => {
  return axiosClient.post<ApiResponse<unknown>>(`/orders/${orderId}/payment`, {
    paymentMethod
  });
};
