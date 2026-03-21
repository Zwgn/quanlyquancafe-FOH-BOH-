import { FormEvent, useEffect, useMemo, useState } from "react";
import StatCard from "../components/ui/StatCard";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import { DashboardStats } from "../types/dashboard";
import { formatCurrency } from "../utils/formatCurrency";
import { getDashboardStats } from "../services/dashboardService";
import {
  createNewOrder,
  deleteExistingOrder,
  getOrdersList,
  updateExistingOrderStatus
} from "../services/ordersService";
import "../assets/styles/dashboard.css";

const defaultStats: DashboardStats = {
  totalRevenue: 125000000,
  totalOrders: 356,
  totalProducts: 84,
  activeEmployees: 12
};

interface DashboardOrder {
  id: string;
  tableId: string;
  employeeId: string;
  status: string;
  createdAt: string;
}

const PAGE_SIZE = 6;

const mapOrder = (input: unknown, index: number): DashboardOrder => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.orderId ?? row.OrderId ?? index),
    tableId: String(row.tableId ?? row.TableId ?? "-"),
    employeeId: String(row.employeeId ?? row.EmployeeId ?? "-"),
    status: String(row.status ?? row.Status ?? "Pending"),
    createdAt: String(row.createdAt ?? row.CreatedAt ?? "-")
  };
};

const DashboardPage = () => {
  usePageTitle("Dashboard | DungCafe Admin");
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orderModal, setOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({ tableId: "", employeeId: "" });
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    const response = await getOrdersList();
    setOrders(response.map(mapOrder));
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [data] = await Promise.all([getDashboardStats(), loadOrders()]);
        setStats(data);
      } catch {
        setError("Khong the tai du lieu dashboard.");
      } finally {
        setLoading(false);
      }
    };

    void loadStats();
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

    if (!orderForm.tableId.trim() || !orderForm.employeeId.trim()) {
      setError("Table ID va Employee ID la bat buoc.");
      return;
    }

    try {
      await createNewOrder({
        tableId: orderForm.tableId.trim(),
        employeeId: orderForm.employeeId.trim()
      });
      setOrderModal(false);
      setOrderForm({ tableId: "", employeeId: "" });
      await loadOrders();
    } catch {
      setError("Khong tao duoc order moi.");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteExistingOrder(id);
      await loadOrders();
    } catch {
      setError("Khong xoa duoc order.");
    }
  };

  const handleStatusToggle = async (id: string, status: string) => {
    try {
      await updateExistingOrderStatus(id, { status });
      await loadOrders();
    } catch {
      setError("Cap nhat status that bai.");
    }
  };

  const columns: DataColumn<DashboardOrder>[] = [
    { key: "id", header: "Order", render: (row) => row.id },
    { key: "table", header: "Table", render: (row) => row.tableId },
    { key: "employee", header: "Employee", render: (row) => row.employeeId },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(event) => void handleStatusToggle(row.id, event.target.value)}
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
          <AppButton variant="danger" onClick={() => void handleDeleteOrder(row.id)}>
            Delete
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page dashboard-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Dashboard Overview</h2>
          <p className="module-breadcrumb">Dashboard / Overview</p>
        </div>
        <AppButton onClick={() => setOrderModal(true)}>Add Quick Order</AppButton>
      </div>
      {loading ? <p>Dang tai du lieu...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      <div className="dashboard-grid">
        <StatCard title="Tong doanh thu" value={formatCurrency(stats.totalRevenue)} />
        <StatCard title="Tong don hang" value={String(stats.totalOrders)} />
        <StatCard title="Tong mon" value={String(stats.totalProducts)} />
        <StatCard title="Nhan vien dang lam" value={String(stats.activeEmployees)} />
      </div>

      <section className="module-card">
        <div className="module-toolbar">
          <h3 className="panel-title">Recent Orders</h3>
          <input
            className="module-search"
            value={search}
            placeholder="Search orders"
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="No recent orders found."
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
        open={orderModal}
        title="Create Quick Order"
        onClose={() => setOrderModal(false)}
      >
        <form className="form-grid" onSubmit={handleCreateOrder}>
          <label className="form-field">
            <span>Table ID</span>
            <input
              value={orderForm.tableId}
              onChange={(event) =>
                setOrderForm((previous) => ({ ...previous, tableId: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Employee ID</span>
            <input
              value={orderForm.employeeId}
              onChange={(event) =>
                setOrderForm((previous) => ({ ...previous, employeeId: event.target.value }))
              }
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Create</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setOrderModal(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default DashboardPage;
