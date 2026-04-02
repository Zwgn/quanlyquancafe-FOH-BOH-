import {
  createIngredient,
  deleteIngredient,
  exportInventory,
  getIngredients,
  importInventory,
  updateIngredient
} from "../api/ingredientsApi";
import { IngredientPayload } from "../types/inventory";

export const getIngredientsList = async () => getIngredients();

export const createNewIngredient = async (payload: IngredientPayload) =>
  createIngredient(payload);

export const updateExistingIngredient = async (id: string, payload: IngredientPayload) =>
  updateIngredient(id, payload);

export const deleteExistingIngredient = async (id: string) => deleteIngredient(id);

export const importIngredientStock = async (ingredientId: string, quantity: number) =>
  importInventory(ingredientId, quantity);

export const exportIngredientStock = async (ingredientId: string, quantity: number) =>
  exportInventory(ingredientId, quantity);
