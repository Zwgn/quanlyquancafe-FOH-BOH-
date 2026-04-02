import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { LoginPayload } from "../types/auth";

export const loginRequest = async (payload: LoginPayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/auth/login", payload);
};

export const getMyProfile = async () => {
  const response = await axiosClient.get<ApiResponse<unknown>>("/auth/me");
  return response.data?.data ?? null;
};
