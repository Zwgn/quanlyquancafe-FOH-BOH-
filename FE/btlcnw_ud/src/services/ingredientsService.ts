import {
  createIngredient,
  deleteIngredient,
  exportInventory,
  getIngredients,
  importInventory
} from "../api/ingredientsApi";
import { IngredientPayload } from "../types/inventory";

export const getIngredientsList = async () => getIngredients();

export const createNewIngredient = async (payload: IngredientPayload) =>
  createIngredient(payload);

export const deleteExistingIngredient = async (id: string) => deleteIngredient(id);

export const importIngredientStock = async (ingredientId: string, quantity: number) =>
  importInventory(ingredientId, quantity);

export const exportIngredientStock = async (ingredientId: string, quantity: number) =>
  exportInventory(ingredientId, quantity);
