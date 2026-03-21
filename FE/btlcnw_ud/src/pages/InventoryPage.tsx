import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createNewIngredient,
  deleteExistingIngredient,
  exportIngredientStock,
  getIngredientsList,
  importIngredientStock
} from "../services/ingredientsService";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { Ingredient } from "../types/ingredient";
import { usePageTitle } from "../hooks/usePageTitle";
import "../assets/styles/inventory.css";

interface IngredientRow extends Ingredient {
  supplierId: string;
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

const InventoryPage = () => {
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
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

  usePageTitle("Inventory | DungCafe Admin");

  const loadIngredients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIngredientsList();
      setIngredients(data.map(mapIngredient));
    } catch {
      setError("Khong tai duoc du lieu kho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInventory = async () => {
      await loadIngredients();
    };

    void loadInventory();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return ingredients;
    }

    return ingredients.filter((item) =>
      [item.name, item.unit, item.quantity].join(" ").toLowerCase().includes(keyword)
    );
  }, [ingredients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!createForm.name.trim() || !createForm.supplierId.trim()) {
      setError("Ten nguyen lieu va supplier ID la bat buoc.");
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
      setError("Them nguyen lieu that bai.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExistingIngredient(id);
      await loadIngredients();
    } catch {
      setError("Xoa nguyen lieu that bai.");
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
      setError("So luong phai lon hon 0.");
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
      setError("Cap nhat ton kho that bai.");
    }
  };

  const columns: DataColumn<IngredientRow>[] = [
    { key: "name", header: "Ingredient", render: (row) => row.name },
    { key: "unit", header: "Unit", render: (row) => row.unit },
    { key: "qty", header: "In Stock", render: (row) => String(row.quantity) },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={() => openStockModal(row.id.toString(), "import")}>
            Import
          </AppButton>
          <AppButton variant="secondary" onClick={() => openStockModal(row.id.toString(), "export")}>
            Export
          </AppButton>
          <AppButton variant="danger" onClick={() => void handleDelete(row.id.toString())}>
            Delete
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page inventory-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Inventory Management</h2>
          <p className="module-breadcrumb">Dashboard / Inventory</p>
        </div>
        <AppButton onClick={() => setCreateOpen(true)}>Add Ingredient</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            placeholder="Search ingredient"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <AppButton variant="ghost" onClick={() => void loadIngredients()} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="No ingredients found."
        />

        <div className="module-pagination">
          <span>
            Page {currentPage}/{totalPages}
          </span>
          <div className="module-pagination-actions">
            <AppButton
              variant="secondary"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </AppButton>
            <AppButton
              variant="secondary"
              onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </AppButton>
          </div>
        </div>
      </section>

      <AppModal
        open={createOpen}
        title="Create Ingredient"
        onClose={() => setCreateOpen(false)}
      >
        <form className="form-grid" onSubmit={handleCreate}>
          <label className="form-field">
            <span>Name</span>
            <input
              value={createForm.name}
              onChange={(event) =>
                setCreateForm((previous) => ({ ...previous, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Unit</span>
            <input
              value={createForm.unit}
              onChange={(event) =>
                setCreateForm((previous) => ({ ...previous, unit: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Initial Stock</span>
            <input
              type="number"
              min={0}
              value={createForm.stockQuantity}
              onChange={(event) =>
                setCreateForm((previous) => ({
                  ...previous,
                  stockQuantity: Number(event.target.value)
                }))
              }
            />
          </label>
          <label className="form-field">
            <span>Supplier ID</span>
            <input
              value={createForm.supplierId}
              onChange={(event) =>
                setCreateForm((previous) => ({
                  ...previous,
                  supplierId: event.target.value
                }))
              }
              required
            />
          </label>

          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Save</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={stockOpen}
        title={stockMode === "import" ? "Import Inventory" : "Export Inventory"}
        onClose={() => setStockOpen(false)}
      >
        <form className="form-grid" onSubmit={handleUpdateStock}>
          <label className="form-field form-field-span">
            <span>Quantity</span>
            <input
              type="number"
              min={1}
              value={stockForm.quantity}
              onChange={(event) =>
                setStockForm({ quantity: Number(event.target.value) })
              }
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Confirm</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setStockOpen(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default InventoryPage;
