import StatCard from "../components/ui/StatCard";
import AppButton from "../components/ui/AppButton";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatCurrency } from "../utils/formatCurrency";
import useDashboard, { DashboardOrder } from "../hooks/useDashboard";
import "../assets/styles/dashboard.css";

const TERMINAL_STATUSES = new Set(["Paid", "Completed", "Cancelled", "Served"]);

const getCurrentRole = (): string => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    return ((JSON.parse(raw) as { role?: string }).role ?? "").trim().toLowerCase();
  } catch {
    return "";
  }
};

const DashboardPage = () => {
  usePageTitle("Bảng điều khiển | Coffee Management System");

  const {
    stats,
    orders: pagedRows,
    tableMap, employeeMap,
    search, setSearch,
    page, setPage, currentPage, totalPages,
    loading, error,
    handleDeleteOrder, handleStatusToggle
  } = useDashboard();

  const columns: DataColumn<DashboardOrder>[] = [
    {
      key: "id",
      header: "Đơn hàng",
      render: (row) => `#${row.id.slice(0, 8).toUpperCase()}`
    },
    {
      key: "table",
      header: "Bàn",
      render: (row) => tableMap[row.tableId] || `Bàn ${row.tableId.slice(0, 6)}`
    },
    {
      key: "employee",
      header: "Nhân viên",
      render: (row) => employeeMap[row.employeeId] || "-"
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (row) => (
        <select
          value={row.status}
          onChange={(event) => void handleStatusToggle(row.id, event.target.value)}
        >
          <option value="Open">Chờ xử lý</option>
          <option value="Preparing">Đang chuẩn bị</option>
          <option value="Ready">Sẵn sàng</option>
          <option value="Completed">Hoàn thành</option>
          <option value="Served">Đã phục vụ</option>
          <option value="Paid">Đã thanh toán</option>
          <option value="Cancelled">Đã hủy</option>
        </select>
      )
    },
    { key: "created", header: "Ngày tạo", render: (row) => row.createdAt },
    {
      key: "actions",
      header: "Hành động",
      render: (row) => {
        const isAdmin = getCurrentRole() === "quản lý";
        const canDelete = isAdmin || !TERMINAL_STATUSES.has(row.status);
        if (!canDelete) return null;
        return (
          <div className="module-row-actions">
            <AppButton variant="danger" onClick={() => void handleDeleteOrder(row.id)}>
              Xóa
            </AppButton>
          </div>
        );
      }
    }
  ];

  return (
    <div className="module-page dashboard-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Bảng điều khiển tổng quan</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Tổng quan</p>
        </div>
      </div>
      {loading ? <p>Đang tải dữ liệu...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      <div className="dashboard-grid">
        <StatCard title="Tổng doanh thu" value={formatCurrency(stats.totalRevenue)} />
        <StatCard title="Tổng đơn hàng" value={String(stats.totalOrders)} />
        <StatCard title="Tổng món" value={String(stats.totalProducts)} />
        <StatCard title="Nhân viên đang làm" value={String(stats.activeEmployees)} />
      </div>

      <section className="module-card">
        <div className="module-toolbar">
          <h3 className="panel-title">Đơn hàng gần đây</h3>
          <input
            className="module-search"
            value={search}
            placeholder="Tìm kiếm đơn hàng"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="Không có đơn hàng gần đây."
        />
        <div className="module-pagination">
          <span>Trang {currentPage}/{totalPages}</span>
          <div className="module-pagination-actions">
            <AppButton variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Trước</AppButton>
            <AppButton variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Sau</AppButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
