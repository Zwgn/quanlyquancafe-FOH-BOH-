import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { IngredientPayload } from "../types/inventory";

export const getIngredients = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/ingredients");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const createIngredient = async (payload: IngredientPayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/ingredients", payload);
};

export const deleteIngredient = async (id: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/ingredients/${id}`);
};

export const importInventory = async (ingredientId: string, quantity: number) => {
  return axiosClient.post<ApiResponse<unknown>>("/inventory/import", {
    ingredientId,
    quantity
  });
};

export const exportInventory = async (ingredientId: string, quantity: number) => {
  return axiosClient.post<ApiResponse<unknown>>("/inventory/export", {
    ingredientId,
    quantity
  });
};
