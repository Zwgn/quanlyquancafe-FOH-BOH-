import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { MenuCategoryOption } from "../types/menu";

export const getMenuCategories = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/menu-categories");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const createMenuCategory = async (payload: Pick<MenuCategoryOption, "name">) => {
  return axiosClient.post<ApiResponse<unknown>>("/menu-categories", payload);
};

export const updateMenuCategory = async (
  id: string,
  payload: Pick<MenuCategoryOption, "name">
) => {
  return axiosClient.put<ApiResponse<unknown>>(`/menu-categories/${id}`, payload);
};

export const deleteMenuCategory = async (id: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/menu-categories/${id}`);
};
