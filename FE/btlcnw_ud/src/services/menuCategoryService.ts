import {
	createMenuCategory,
	deleteMenuCategory,
	getMenuCategories,
	updateMenuCategory
} from "../api/menuCategoryApi";
import { MenuCategoryOption } from "../types/menu";

export const getMenuCategoriesList = async () => getMenuCategories();

export const createNewMenuCategory = async (payload: Pick<MenuCategoryOption, "name">) =>
	createMenuCategory(payload);

export const updateExistingMenuCategory = async (
	id: string,
	payload: Pick<MenuCategoryOption, "name">
) => updateMenuCategory(id, payload);

export const deleteExistingMenuCategory = async (id: string) => deleteMenuCategory(id);
