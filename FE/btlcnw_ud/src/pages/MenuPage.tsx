import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createNewMenuItem,
  deleteExistingMenuItem,
  getMenuItemsList,
  updateExistingMenuItem
} from "../services/menuService";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatCurrency } from "../utils/formatCurrency";
import "../assets/styles/menu.css";

interface MenuRow {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  active: boolean;
}

const PAGE_SIZE = 8;

const mapMenuItem = (input: unknown, index: number): MenuRow => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.menuItemId ?? row.MenuItemId ?? index),
    name: String(row.name ?? row.Name ?? "Unnamed item"),
    category: String(
      row.category ?? row.Category ?? row.categoryName ?? row.CategoryName ?? row.categoryId ?? row.CategoryId ?? "-"
    ),
    categoryId: String(row.categoryId ?? row.CategoryId ?? "-"),
    price: Number(row.price ?? row.Price ?? 0),
    active: Boolean(row.active ?? row.Active ?? row.isActive ?? row.IsActive ?? true)
  };
};

const MenuPage = () => {
  usePageTitle("Menu | DungCafe Admin");

  const [menuItems, setMenuItems] = useState<MenuRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuRow | null>(null);
  const [form, setForm] = useState({ name: "", categoryId: "", price: 0 });

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMenuItemsList();
      setMenuItems(response.map(mapMenuItem));
    } catch {
      setError("Khong tai duoc danh sach thuc don.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMenu();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return menuItems;
    }

    return menuItems.filter((item) =>
      [item.name, item.category, item.categoryId, item.price]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [menuItems, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({ name: "", categoryId: "", price: 0 });
    setOpenModal(true);
  };

  const openEditModal = (item: MenuRow) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      categoryId: item.categoryId,
      price: item.price
    });
    setOpenModal(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || form.price <= 0) {
      setError("Ten mon va gia tien phai hop le.");
      return;
    }

    try {
      if (editingItem) {
        await updateExistingMenuItem(editingItem.id, {
          name: form.name.trim(),
          price: Number(form.price)
        });
      } else {
        if (!form.categoryId.trim()) {
          setError("Category ID bat buoc khi them moi.");
          return;
        }

        await createNewMenuItem({
          name: form.name.trim(),
          categoryId: form.categoryId.trim(),
          price: Number(form.price)
        });
      }

      setOpenModal(false);
      await loadMenu();
    } catch {
      setError("Khong luu duoc mon.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExistingMenuItem(id);
      await loadMenu();
    } catch {
      setError("Xoa mon that bai.");
    }
  };

  const handleToggleStatus = (id: string) => {
    setMenuItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              active: !item.active
            }
          : item
      )
    );
  };

  const columns: DataColumn<MenuRow>[] = [
    { key: "name", header: "Item", render: (row) => row.name },
    { key: "category", header: "Category", render: (row) => row.category },
    { key: "price", header: "Price", render: (row) => formatCurrency(row.price) },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <button
          className={row.active ? "menu-status-active" : "menu-status-inactive"}
          onClick={() => handleToggleStatus(row.id)}
          type="button"
        >
          {row.active ? "Active" : "Inactive"}
        </button>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={() => openEditModal(row)}>
            Edit
          </AppButton>
          <AppButton variant="danger" onClick={() => void handleDelete(row.id)}>
            Delete
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page menu-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Menu Management</h2>
          <p className="module-breadcrumb">Dashboard / Menu</p>
        </div>
        <AppButton onClick={openCreateModal}>Add Menu Item</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            placeholder="Search item name/category"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <AppButton variant="ghost" onClick={() => void loadMenu()} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="No menu item found."
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
        open={openModal}
        title={editingItem ? "Edit Menu Item" : "Create Menu Item"}
        onClose={() => setOpenModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Name</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Price</span>
            <input
              type="number"
              min={1000}
              value={form.price}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, price: Number(event.target.value) }))
              }
              required
            />
          </label>

          {!editingItem ? (
            <label className="form-field form-field-span">
              <span>Category ID</span>
              <input
                value={form.categoryId}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, categoryId: event.target.value }))
                }
                required
              />
            </label>
          ) : null}

          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Save</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setOpenModal(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default MenuPage;
