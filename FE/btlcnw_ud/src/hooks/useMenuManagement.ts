import { useEffect, useMemo, useState } from "react";
import {
  createNewMenuItem,
  deleteExistingMenuItem,
  getMenuItemsList,
  updateExistingMenuItem
} from "../services/menuService";
import { uploadMenuImage } from "../api/menuApi";
import { getMenuCategoriesList } from "../services/menuCategoryService";
import { MenuCardItem, MenuCategoryOption, MenuFormState } from "../types/menu";
import { mapMenuCategory, mapMenuItem } from "../utils/menuMapper";
import { useConfirm } from "../components/ui/ConfirmDialog";

const EMPTY_FORM: MenuFormState = {
  name: "",
  categoryId: "",
  price: "",
  imgUrl: ""
};

export const useMenuManagement = () => {
  const confirm = useConfirm();
  const [items, setItems] = useState<MenuCardItem[]>([]);
  const [categories, setCategories] = useState<MenuCategoryOption[]>([]);
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuCardItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [menuResponse, categoriesResponse] = await Promise.all([
        getMenuItemsList(),
        getMenuCategoriesList()
      ]);

      setItems(menuResponse.map(mapMenuItem));
      setCategories(categoriesResponse.map(mapMenuCategory));
    } catch {
      setError("Không tải được danh sách thực đơn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMenuData();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const selectedCategoryName =
      categoryFilter === "all"
        ? ""
        : categories
            .find((category) => category.id === categoryFilter)
            ?.name.trim()
            .toLowerCase() ?? "";

    return items.filter((item) => {
      const matchKeyword =
        !normalizedKeyword ||
        [item.name, item.categoryName].join(" ").toLowerCase().includes(normalizedKeyword);

      const normalizedItemCategoryId = item.categoryId.trim();
      const normalizedItemCategoryName = item.categoryName.trim().toLowerCase();

      const matchCategory =
        categoryFilter === "all" ||
        (normalizedItemCategoryId !== "" && normalizedItemCategoryId === categoryFilter) ||
        (normalizedItemCategoryId === "" &&
          selectedCategoryName !== "" &&
          normalizedItemCategoryName === selectedCategoryName);

      return matchKeyword && matchCategory;
    });
  }, [items, keyword, categoryFilter, categories]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setOpenModal(true);
  };

  const openEditModal = (item: MenuCardItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      categoryId: item.categoryId,
      price: String(item.price),
      imgUrl: item.imgUrl
    });
    setImageFile(null);
    setOpenModal(true);
  };

  const handleSaveItem = async () => {
    const parsedPrice = Number(form.price);

    if (!form.name.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Vui lòng nhập tên món và giá hợp lệ.");
      return;
    }

    if (!form.categoryId.trim()) {
      setError("Vui lòng chọn danh mục.");
      return;
    }

    try {
      setError(null);

      let finalImgUrl = form.imgUrl.trim() || null;

      if (imageFile) {
        setUploading(true);
        try {
          const uploadedUrl = await uploadMenuImage(imageFile);
          finalImgUrl = uploadedUrl || finalImgUrl;
        } finally {
          setUploading(false);
        }
      }

      if (editingItem) {
        await updateExistingMenuItem(editingItem.id, {
          name: form.name.trim(),
          categoryId: form.categoryId.trim(),
          price: parsedPrice,
          imgUrl: finalImgUrl
        });
      } else {
        await createNewMenuItem({
          name: form.name.trim(),
          categoryId: form.categoryId.trim(),
          price: parsedPrice,
          imgUrl: finalImgUrl
        });
      }

      setOpenModal(false);
      await loadMenuData();
    } catch {
      setError("Lưu món thất bại.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    const ok = await confirm({
      title: "Xóa món",
      message: "Bạn có chắc chắn muốn xóa món này? Hành động không thể hoàn tác.",
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      setError(null);
      await deleteExistingMenuItem(id);
      await loadMenuData();
    } catch {
      setError("Xóa món thất bại.");
    }
  };

  return {
    items: filteredItems,
    categories,
    keyword,
    setKeyword,
    categoryFilter,
    setCategoryFilter,
    openModal,
    setOpenModal,
    editingItem,
    error,
    loading,
    form,
    setForm,
    imageFile,
    setImageFile,
    uploading,
    openCreateModal,
    openEditModal,
    handleSaveItem,
    handleDeleteItem,
    reloadMenuData: loadMenuData
  };
};
