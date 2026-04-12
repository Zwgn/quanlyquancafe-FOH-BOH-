import { MenuCardItem, MenuCategoryOption } from "../types/menu";

export const mapMenuItem = (input: unknown, index: number): MenuCardItem => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.menuItemId ?? row.MenuItemId ?? index),
    name: String(row.name ?? row.Name ?? "Món mới"),
    categoryId: String(row.categoryId ?? row.CategoryId ?? ""),
    categoryName: String(
      row.category ?? row.Category ?? row.categoryName ?? row.CategoryName ?? "Chưa phân loại"
    ),
    price: Number(row.price ?? row.Price ?? 0),
    imgUrl: typeof row.imgUrl === "string" ? row.imgUrl : ""
  };
};

export const mapMenuCategory = (input: unknown, index: number): MenuCategoryOption => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.categoryId ?? row.CategoryId ?? index),
    name: String(row.name ?? row.Name ?? `Danh mục ${index + 1}`)
  };
};
