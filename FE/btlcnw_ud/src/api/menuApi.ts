import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { MenuItemPayload } from "../types/menu";

export const getMenuItems = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/menu-items");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const createMenuItem = async (payload: MenuItemPayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/menu-items", payload);
};

export const updateMenuItem = async (
  id: string,
  payload: Pick<MenuItemPayload, "name" | "categoryId" | "price" | "imgUrl">
) => {
  return axiosClient.put<ApiResponse<unknown>>(`/menu-items/${id}`, payload);
};

export const deleteMenuItem = async (id: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/menu-items/${id}`);
};

export const uploadMenuImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axiosClient.post<ApiResponse<{ url: string }>>(
    "/upload",
    formData,
    { headers: { "Content-Type": undefined } }
  );
  return response.data.data?.url ?? "";
};
