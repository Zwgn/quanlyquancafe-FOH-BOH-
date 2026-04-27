import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createMenuItemIngredient,
  deleteMenuItemIngredient,
  getIngredientsByMenuItem,
  updateMenuItemIngredient
} from "../api/menuItemIngredientsApi";
import { getMenuItems } from "../api/menuApi";
import { getIngredients } from "../api/ingredientsApi";
import { useConfirm } from "../components/ui/ConfirmDialog";
import { getApiErrorMessage } from "../utils/apiError";

export interface MenuItemOption {
  id: string;
  name: string;
  imgUrl: string;
  price: number;
}

export interface IngredientOption {
  id: string;
  name: string;
  unit: string;
}

export interface RecipeRow {
  id: string;
  ingredientName: string;
  unit: string;
  quantity: number;
}

const mapMenuItem = (input: unknown, index: number): MenuItemOption => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? index),
    name: String(row.name ?? row.Name ?? ""),
    imgUrl: String(row.imgUrl ?? row.ImageUrl ?? row.imageUrl ?? ""),
    price: Number(row.price ?? row.Price ?? 0)
  };
};

const mapIngredient = (input: unknown, index: number): IngredientOption => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? index),
    name: String(row.name ?? row.Name ?? ""),
    unit: String(row.unit ?? row.Unit ?? "")
  };
};

const mapRecipeRow = (input: unknown, index: number): RecipeRow => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? index),
    ingredientName: String(row.ingredientName ?? row.IngredientName ?? row.name ?? row.Name ?? ""),
    unit: String(row.unit ?? row.Unit ?? ""),
    quantity: Number(row.quantity ?? row.Quantity ?? 0)
  };
};

const useRecipes = () => {
  const confirm = useConfirm();

  const [menuItems, setMenuItems] = useState<MenuItemOption[]>([]);
  const [ingredients, setIngredients] = useState<IngredientOption[]>([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>("");
  const [recipe, setRecipe] = useState<RecipeRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeRow | null>(null);
  const [form, setForm] = useState({ ingredientId: "", quantity: "" });

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [menuResponse, ingredientResponse] = await Promise.all([
        getMenuItems(),
        getIngredients()
      ]);
      const mappedMenu = menuResponse.map(mapMenuItem);
      setMenuItems(mappedMenu);
      setIngredients(ingredientResponse.map(mapIngredient));
      if (mappedMenu.length > 0 && !selectedMenuItemId) {
        setSelectedMenuItemId(mappedMenu[0].id);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Không tải được dữ liệu."));
    } finally {
      setLoading(false);
    }
  };

  const loadRecipe = async (menuItemId: string) => {
    if (!menuItemId) { setRecipe([]); return; }
    try {
      setError(null);
      const response = await getIngredientsByMenuItem(menuItemId);
      setRecipe(response.map(mapRecipeRow));
    } catch (err) {
      setError(getApiErrorMessage(err, "Không tải được công thức."));
    }
  };

  useEffect(() => { void loadInitialData(); }, []);
  useEffect(() => { void loadRecipe(selectedMenuItemId); }, [selectedMenuItemId]);

  const filteredMenuItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return menuItems;
    return menuItems.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [menuItems, search]);

  const selectedMenuItem = menuItems.find((item) => item.id === selectedMenuItemId);

  const usedIngredientNames = new Set(recipe.map((row) => row.ingredientName));
  const availableIngredients = ingredients.filter((ing) => !usedIngredientNames.has(ing.name));

  const openCreateModal = () => {
    if (!selectedMenuItemId) {
      setError("Vui lòng chọn món trước khi thêm nguyên liệu.");
      return;
    }
    setEditingRecipe(null);
    setForm({ ingredientId: "", quantity: "" });
    setOpenModal(true);
  };

  const openEditModal = (row: RecipeRow) => {
    setEditingRecipe(row);
    setForm({ ingredientId: "", quantity: String(row.quantity) });
    setOpenModal(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedQty = Number(form.quantity);
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      setError("Số lượng phải là số dương.");
      return;
    }
    try {
      if (editingRecipe) {
        await updateMenuItemIngredient(editingRecipe.id, { quantity: parsedQty });
      } else {
        if (!form.ingredientId.trim()) {
          setError("Vui lòng chọn nguyên liệu.");
          return;
        }
        await createMenuItemIngredient(selectedMenuItemId, {
          ingredientId: form.ingredientId,
          quantity: parsedQty
        });
      }
      setOpenModal(false);
      await loadRecipe(selectedMenuItemId);
    } catch (err) {
      setError(getApiErrorMessage(err, "Không lưu được công thức."));
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Xóa nguyên liệu",
      message: "Xóa nguyên liệu này khỏi công thức món?",
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      await deleteMenuItemIngredient(id);
      await loadRecipe(selectedMenuItemId);
    } catch (err) {
      setError(getApiErrorMessage(err, "Xóa nguyên liệu thất bại."));
    }
  };

  return {
    menuItems: filteredMenuItems,
    allMenuItems: menuItems,
    ingredients,
    availableIngredients,
    selectedMenuItemId, setSelectedMenuItemId,
    selectedMenuItem,
    recipe,
    search, setSearch,
    error, loading,
    openModal, setOpenModal,
    editingRecipe,
    form, setForm,
    openCreateModal, openEditModal,
    handleSubmit, handleDelete
  };
};

export default useRecipes;
