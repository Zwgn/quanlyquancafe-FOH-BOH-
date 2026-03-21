import axiosClient from "./axiosClient";
import { Ingredient } from "../types/ingredient";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const mapToIngredient = (record: unknown, index: number): Ingredient => {
  const row = (record ?? {}) as Record<string, unknown>;

  return {
    id: (row.id as string | number) ||
      (row.Id as string | number) ||
      (row.ingredientId as string | number) ||
      (row.IngredientId as string | number) ||
      index,
    name:
      (row.name as string) ||
      (row.Name as string) ||
      (row.ingredientName as string) ||
      (row.IngredientName as string) ||
      "N/A",
    unit: (row.unit as string) || (row.Unit as string) || "",
    quantity: toNumber(
      row.quantity ?? row.Quantity ?? row.stockQuantity ?? row.StockQuantity
    )
  };
};

export const fetchInventoryTransactions = async (): Promise<Ingredient[]> => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/inventory");
  const records = response.data?.data;
  return Array.isArray(records)
    ? records.map((record, index) => mapToIngredient(record, index))
    : [];
};
