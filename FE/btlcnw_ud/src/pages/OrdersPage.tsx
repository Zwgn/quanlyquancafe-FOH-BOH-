import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addItemToOrder,
  createNewOrder,
  deleteExistingOrder,
  getOrdersList,
  updateExistingOrderStatus
} from "../services/ordersService";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import "../assets/styles/orders.css";

interface OrderRow {
  id: string;
  tableId: string;
  employeeId: string;
  status: string;
  createdAt: string;
}

const PAGE_SIZE = 8;

const mapOrderRow = (input: unknown, index: number): OrderRow => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.orderId ?? row.OrderId ?? index),
    tableId: String(row.tableId ?? row.TableId ?? "-"),
    employeeId: String(row.employeeId ?? row.EmployeeId ?? "-"),
    status: String(row.status ?? row.Status ?? "Pending"),
    createdAt: String(row.createdAt ?? row.CreatedAt ?? "-")
  };
};

const OrdersPage = () => {
  usePageTitle("Orders | DungCafe Admin");

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [createForm, setCreateForm] = useState({ tableId: "", employeeId: "" });
  const [itemForm, setItemForm] = useState({ menuItemId: "", quantity: 1 });

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrdersList();
      setOrders(response.map(mapOrderRow));
    } catch {
      setError("Không tải được danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((item) =>
      [item.id, item.tableId, item.employeeId, item.status]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [orders, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCreateOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!createForm.tableId.trim() || !createForm.employeeId.trim()) {
      setError("Table ID và Employee ID không được để trống.");
      return;
    }

    try {
      await createNewOrder({
        tableId: createForm.tableId.trim(),
        employeeId: createForm.employeeId.trim()
      });
      setCreateOpen(false);
      setCreateForm({ tableId: "", employeeId: "" });
      await loadOrders();
    } catch {
      setError("Không tạo được đơn hàng.");
    }
  };

  const handleChangeStatus = async (orderId: string, status: string) => {
    try {
      await updateExistingOrderStatus(orderId, { status });
      await loadOrders();
    } catch {
      setError("Cập nhật trạng thái đơn hàng thất bại.");
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await deleteExistingOrder(orderId);
      await loadOrders();
    } catch {
      setError("Xóa đơn hàng thất bại.");
    }
  };

  const handleOpenAddItem = (orderId: string) => {
    setSelectedOrderId(orderId);
    setItemForm({ menuItemId: "", quantity: 1 });
    setAddItemOpen(true);
  };

  const handleAddOrderItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedOrderId || !itemForm.menuItemId.trim() || itemForm.quantity <= 0) {
      setError("Vui lòng nhập đầy đủ menuItemId và quantity > 0.");
      return;
    }

    try {
      await addItemToOrder(selectedOrderId, {
        menuItemId: itemForm.menuItemId.trim(),
        quantity: Number(itemForm.quantity)
      });
      setAddItemOpen(false);
    } catch {
      setError("Thêm món vào đơn hàng thất bại.");
    }
  };

  const columns: DataColumn<OrderRow>[] = [
    { key: "id", header: "Order ID", render: (row) => row.id },
    { key: "table", header: "Table", render: (row) => row.tableId },
    { key: "employee", header: "Employee", render: (row) => row.employeeId },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(event) => void handleChangeStatus(row.id, event.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Served">Served</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    },
    { key: "created", header: "Created", render: (row) => row.createdAt },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={() => handleOpenAddItem(row.id)}>
            Add Item
          </AppButton>
          <AppButton variant="danger" onClick={() => void handleDelete(row.id)}>
            Delete
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page orders-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Orders Management</h2>
          <p className="module-breadcrumb">Dashboard / Orders</p>
        </div>
        <AppButton onClick={() => setCreateOpen(true)}>Add Order</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            placeholder="Search by order/table/employee/status"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <AppButton variant="ghost" onClick={() => void loadOrders()} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="No order found."
        />

        <div className="module-pagination">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
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
        title="Create New Order"
        onClose={() => setCreateOpen(false)}
      >
        <form className="form-grid" onSubmit={handleCreateOrder}>
          <label className="form-field">
            <span>Table ID</span>
            <input
              value={createForm.tableId}
              onChange={(event) =>
                setCreateForm((previous) => ({ ...previous, tableId: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Employee ID</span>
            <input
              value={createForm.employeeId}
              onChange={(event) =>
                setCreateForm((previous) => ({
                  ...previous,
                  employeeId: event.target.value
                }))
              }
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Submit</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={addItemOpen}
        title={`Add Item to Order ${selectedOrderId}`}
        onClose={() => setAddItemOpen(false)}
      >
        <form className="form-grid" onSubmit={handleAddOrderItem}>
          <label className="form-field">
            <span>Menu Item ID</span>
            <input
              value={itemForm.menuItemId}
              onChange={(event) =>
                setItemForm((previous) => ({ ...previous, menuItemId: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Quantity</span>
            <input
              type="number"
              min={1}
              value={itemForm.quantity}
              onChange={(event) =>
                setItemForm((previous) => ({
                  ...previous,
                  quantity: Number(event.target.value)
                }))
              }
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Add Item</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setAddItemOpen(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default OrdersPage;
