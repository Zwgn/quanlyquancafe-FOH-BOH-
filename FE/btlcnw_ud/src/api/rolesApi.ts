import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";

interface RolePayload {
  name: string;
}

export const getRoles = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/roles");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const createRole = async (payload: RolePayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/roles", payload);
};
