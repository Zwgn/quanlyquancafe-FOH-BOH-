import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";

export interface UserPayload {
  username: string;
  password: string;
  roleId: string;
}

export const getUsers = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/users");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const getUserById = async (id: string) => {
  const response = await axiosClient.get<ApiResponse<unknown>>(`/users/${id}`);
  return response.data?.data ?? null;
};

export const createUser = async (payload: UserPayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/users", payload);
};

export const updateUser = async (id: string, payload: UserPayload) => {
  return axiosClient.put<ApiResponse<unknown>>(`/users/${id}`, payload);
};

export const deleteUser = async (id: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/users/${id}`);
};
