import {
  createMenuItemIngredient,
  deleteMenuItemIngredient,
  getIngredientsByMenuItem,
  MenuItemIngredientPayload,
  MenuItemIngredientUpdatePayload,
  updateMenuItemIngredient
} from "../api/menuItemIngredientsApi";

export const getMenuItemIngredientsList = async (menuItemId: string) =>
  getIngredientsByMenuItem(menuItemId);

export const createNewMenuItemIngredient = async (
  menuItemId: string,
  payload: MenuItemIngredientPayload
) => createMenuItemIngredient(menuItemId, payload);

export const updateExistingMenuItemIngredient = async (
  id: string,
  payload: MenuItemIngredientUpdatePayload
) => updateMenuItemIngredient(id, payload);

export const deleteExistingMenuItemIngredient = async (id: string) =>
  deleteMenuItemIngredient(id);
