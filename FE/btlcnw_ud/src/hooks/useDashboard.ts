import { FormEvent, useEffect, useMemo, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import {
  createNewOrder,
  deleteExistingOrder,
  getOrdersList,
  updateExistingOrderStatus
} from "../services/ordersService";
import { getTablesList } from "../services/tablesService";
import { getEmployeesList } from "../services/employeesService";
import { useConfirm } from "../components/ui/ConfirmDialog";
import { DashboardStats } from "../types/dashboard";

export interface DashboardOrder {
  id: string;
  tableId: string;
  employeeId: string;
  status: string;
  createdAt: string;
}

const PAGE_SIZE = 6;

const defaultStats: DashboardStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  activeEmployees: 0
};

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

const useDashboard = () => {
  const confirm = useConfirm();

  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [tableMap, setTableMap] = useState<Record<string, string>>({});
  const [employeeMap, setEmployeeMap] = useState<Record<string, string>>({});
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

  const loadLookups = async () => {
    try {
      const [tablesResponse, employeesResponse] = await Promise.all([
        getTablesList(),
        getEmployeesList().catch(() => [] as unknown[])
      ]);

      const tMap: Record<string, string> = {};
      (tablesResponse as unknown[]).forEach((item) => {
        const row = (item ?? {}) as Record<string, unknown>;
        const id = String(row.id ?? row.Id ?? "");
        const name = String(row.name ?? row.Name ?? "");
        if (id) tMap[id] = name || `Bàn ${id.slice(0, 6)}`;
      });
      setTableMap(tMap);

      const eMap: Record<string, string> = {};
      (employeesResponse as unknown[]).forEach((item) => {
        const row = (item ?? {}) as Record<string, unknown>;
        const id = String(row.id ?? row.Id ?? "");
        const name = String(row.name ?? row.Name ?? row.fullName ?? row.FullName ?? "");
        if (id) eMap[id] = name || "-";
      });
      setEmployeeMap(eMap);
    } catch {
      /* bỏ qua lỗi nhỏ, vẫn hiển thị được đơn hàng */
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data] = await Promise.all([getDashboardStats(), loadOrders(), loadLookups()]);
        setStats(data);
      } catch {
        setError("Không tải được dữ liệu bảng điều khiển.");
      } finally {
        setLoading(false);
      }
    };
    void loadStats();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return orders;
    return orders.filter((item) =>
      [
        item.id,
        item.tableId,
        item.employeeId,
        tableMap[item.tableId] ?? "",
        employeeMap[item.employeeId] ?? "",
        item.status
      ].join(" ").toLowerCase().includes(keyword)
    );
  }, [orders, search, tableMap, employeeMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCreateOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orderForm.tableId.trim() || !orderForm.employeeId.trim()) {
      setError("Mã bàn và mã nhân viên là bắt buộc.");
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
      setError("Không tạo được đơn hàng mới.");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    const ok = await confirm({
      title: "Xóa đơn hàng",
      message: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      await deleteExistingOrder(id);
      await loadOrders();
    } catch {
      setError("Không xóa được đơn hàng.");
    }
  };

  const handleStatusToggle = async (id: string, status: string) => {
    try {
      await updateExistingOrderStatus(id, { status });
      await loadOrders();
    } catch {
      setError("Không thể cập nhật trạng thái.");
    }
  };

  return {
    stats,
    orders: pagedRows,
    tableMap, employeeMap,
    search, setSearch: (v: string) => { setSearch(v); setPage(1); },
    page, setPage, currentPage, totalPages,
    loading, error,
    orderModal, setOrderModal,
    orderForm, setOrderForm,
    loadOrders,
    handleCreateOrder, handleDeleteOrder, handleStatusToggle
  };
};

export default useDashboard;
