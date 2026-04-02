import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";

export const getPayments = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/payments");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const checkoutPayment = async (orderId: string, paymentMethod: string) => {
  return axiosClient.post<ApiResponse<unknown>>(`/orders/${orderId}/payment`, {
    paymentMethod
  });
};
