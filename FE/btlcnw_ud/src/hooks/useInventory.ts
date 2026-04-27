import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createNewIngredient,
  deleteExistingIngredient,
  exportIngredientStock,
  getIngredientsList,
  importIngredientStock
} from "../services/ingredientsService";
import { getSuppliersList } from "../services/suppliersService";
import { useConfirm } from "../components/ui/ConfirmDialog";
import { Ingredient } from "../types/ingredient";

export interface IngredientRow extends Ingredient {
  supplierId: string;
}

export interface SupplierOption {
  id: string;
  name: string;
}

const PAGE_SIZE = 8;

const mapIngredient = (input: unknown, index: number): IngredientRow => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? row.ingredientId ?? row.IngredientId ?? index),
    name: String(row.name ?? row.Name ?? ""),
    unit: String(row.unit ?? row.Unit ?? ""),
    quantity: Number(row.quantity ?? row.Quantity ?? row.stockQuantity ?? row.StockQuantity ?? 0),
    supplierId: String(row.supplierId ?? row.SupplierId ?? "")
  };
};

const useInventory = () => {
  const confirm = useConfirm();

  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [stockMode, setStockMode] = useState<"import" | "export">("import");
  const [selectedId, setSelectedId] = useState("");
  const [createForm, setCreateForm] = useState({
    name: "",
    unit: "kg",
    stockQuantity: 0,
    supplierId: ""
  });
  const [stockForm, setStockForm] = useState({ quantity: 0 });

  const loadIngredients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIngredientsList();
      setIngredients(data.map(mapIngredient));
    } catch {
      setError("Không tải được dữ liệu kho.");
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await getSuppliersList();
      const mapped = (data as unknown[]).map((item) => {
        const row = (item ?? {}) as Record<string, unknown>;
        return {
          id: String(row.id ?? row.Id ?? ""),
          name: String(row.name ?? row.Name ?? "")
        };
      }).filter((item) => item.id);
      setSuppliers(mapped);
    } catch {
      /* silent – không chặn màn hình chính */
    }
  };

  useEffect(() => {
    void Promise.all([loadIngredients(), loadSuppliers()]);
  }, []);

  const supplierMap = useMemo(() => {
    const map: Record<string, string> = {};
    suppliers.forEach((item) => { map[item.id] = item.name; });
    return map;
  }, [suppliers]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return ingredients;
    return ingredients.filter((item) =>
      [item.name, item.unit, item.quantity].join(" ").toLowerCase().includes(keyword)
    );
  }, [ingredients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!createForm.name.trim() || !createForm.supplierId.trim()) {
      setError("Tên nguyên liệu và nhà cung cấp là bắt buộc.");
      return;
    }
    try {
      await createNewIngredient({
        name: createForm.name.trim(),
        unit: createForm.unit.trim(),
        stockQuantity: Number(createForm.stockQuantity),
        supplierId: createForm.supplierId.trim()
      });
      setCreateOpen(false);
      setCreateForm({ name: "", unit: "kg", stockQuantity: 0, supplierId: "" });
      await loadIngredients();
    } catch {
      setError("Thêm nguyên liệu thất bại.");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Xóa nguyên liệu",
      message: "Bạn có chắc chắn muốn xóa nguyên liệu này?",
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      await deleteExistingIngredient(id);
      await loadIngredients();
    } catch {
      setError("Xóa nguyên liệu thất bại.");
    }
  };

  const openStockModal = (id: string, mode: "import" | "export") => {
    setSelectedId(id);
    setStockMode(mode);
    setStockForm({ quantity: 0 });
    setStockOpen(true);
  };

  const handleUpdateStock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedId || stockForm.quantity <= 0) {
      setError("Số lượng phải lớn hơn 0.");
      return;
    }
    try {
      if (stockMode === "import") {
        await importIngredientStock(selectedId, Number(stockForm.quantity));
      } else {
        await exportIngredientStock(selectedId, Number(stockForm.quantity));
      }
      setStockOpen(false);
      await loadIngredients();
    } catch {
      setError("Cập nhật tồn kho thất bại.");
    }
  };

  return {
    ingredients: pagedRows,
    suppliers, supplierMap,
    search, setSearch: (v: string) => { setSearch(v); setPage(1); },
    page, setPage, currentPage, totalPages,
    error, loading,
    createOpen, setCreateOpen,
    stockOpen, setStockOpen,
    stockMode,
    createForm, setCreateForm,
    stockForm, setStockForm,
    loadIngredients,
    handleCreate, handleDelete, openStockModal, handleUpdateStock
  };
};

export default useInventory;
