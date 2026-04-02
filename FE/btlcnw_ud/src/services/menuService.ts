import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem
} from "../api/menuApi";
import { MenuItemPayload } from "../types/menu";

export const getMenuItemsList = async () => getMenuItems();

export const createNewMenuItem = async (payload: MenuItemPayload) =>
  createMenuItem(payload);

export const updateExistingMenuItem = async (
  id: string,
  payload: Pick<MenuItemPayload, "name" | "categoryId" | "price" | "imgUrl">
) => updateMenuItem(id, payload);

export const deleteExistingMenuItem = async (id: string) => deleteMenuItem(id);
