import AppButton from "../components/ui/AppButton";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatCurrency } from "../utils/formatCurrency";
import usePayments, { PaymentRow, translatePaymentMethod } from "../hooks/usePayments";

const formatDate = (value: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
};

const PaymentsPage = () => {
  usePageTitle("Lịch sử thanh toán | Coffee Management System");

  const {
    payments: pagedRows,
    filteredCount,
    totalRevenue,
    search, setSearch,
    filterDate, setFilterDate,
    page, setPage, currentPage, totalPages,
    error, loading,
    loadPayments
  } = usePayments();

  const columns: DataColumn<PaymentRow>[] = [
    {
      key: "orderId",
      header: "Mã đơn",
      render: (row) => `#${row.orderId.slice(0, 8)}`
    },
    { key: "table", header: "Bàn", render: (row) => row.tableName },
    { key: "employee", header: "Nhân viên", render: (row) => row.employeeName },
    {
      key: "method",
      header: "Phương thức",
      render: (row) => translatePaymentMethod(row.paymentMethod)
    },
    {
      key: "amount",
      header: "Số tiền",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#16a34a" }}>{formatCurrency(row.amount)}</span>
      )
    },
    { key: "paidAt", header: "Thời gian", render: (row) => formatDate(row.paidAt) }
  ];

  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Lịch sử thanh toán</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Lịch sử thanh toán</p>
        </div>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section
        className="reports-kpi-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}
      >
        <article className="module-card reports-kpi-card">
          <p>Tổng giao dịch</p>
          <h3>{filteredCount}</h3>
          <small>{filterDate ? `Ngày ${filterDate}` : "Tất cả"}</small>
        </article>
        <article className="module-card reports-kpi-card">
          <p>Tổng doanh thu</p>
          <h3>{formatCurrency(totalRevenue)}</h3>
          <small>Lọc hiện tại</small>
        </article>
        <article className="module-card reports-kpi-card">
          <p>Trung bình / đơn</p>
          <h3>
            {formatCurrency(filteredCount > 0 ? Math.round(totalRevenue / filteredCount) : 0)}
          </h3>
          <small>Lọc hiện tại</small>
        </article>
      </section>

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            placeholder="Tìm theo mã đơn, bàn, nhân viên, phương thức..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: "10px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 14
            }}
          />
          {filterDate ? (
            <AppButton variant="ghost" onClick={() => setFilterDate("")}>
              Xóa lọc ngày
            </AppButton>
          ) : null}
          <AppButton variant="ghost" onClick={() => void loadPayments()} disabled={loading}>
            {loading ? "Đang tải..." : "Làm mới"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText={loading ? "Đang tải..." : "Chưa có giao dịch nào."}
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

export default PaymentsPage;
