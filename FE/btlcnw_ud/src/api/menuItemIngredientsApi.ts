import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";

export interface MenuItemIngredientPayload {
  ingredientId: string;
  quantity: number;
}

export interface MenuItemIngredientUpdatePayload {
  quantity: number;
}

export const getIngredientsByMenuItem = async (menuItemId: string) => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>(
    `/menu-items/${menuItemId}/ingredients`
  );
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const createMenuItemIngredient = async (
  menuItemId: string,
  payload: MenuItemIngredientPayload
) => {
  return axiosClient.post<ApiResponse<unknown>>(`/menu-items/${menuItemId}/ingredients`, payload);
};

export const updateMenuItemIngredient = async (
  id: string,
  payload: MenuItemIngredientUpdatePayload
) => {
  return axiosClient.put<ApiResponse<unknown>>(`/menu-item-ingredients/${id}`, payload);
};

export const deleteMenuItemIngredient = async (id: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/menu-item-ingredients/${id}`);
};
