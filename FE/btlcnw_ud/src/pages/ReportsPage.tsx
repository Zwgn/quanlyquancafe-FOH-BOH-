import React from "react";
import { MdPrint } from "react-icons/md";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatCurrency } from "../utils/formatCurrency";
import { escapeHtmlText, openPrintWindow } from "../utils/printDocument";
import useReports, { LowStockRow } from "../hooks/useReports";
import "../assets/styles/reports.css";

const ReportsPage = () => {
  usePageTitle("Báo cáo | Coffee Management System");

  const {
    dailyRevenue,
    bestSelling,
    lowStock,
    lowStockPaged: pagedRows,
    filters, setFilters,
    search, setSearch,
    page, setPage, currentPage, totalPages,
    error, loading,
    openFilter, setOpenFilter,
    handleApplyFilter
  } = useReports();

  const lowStockColumns: DataColumn<LowStockRow>[] = [
    { key: "ingredient", header: "Nguyên liệu", render: (row) => row.ingredient },
    { key: "unit", header: "Đơn vị", render: (row) => row.unit },
    { key: "stock", header: "Tồn hiện tại", render: (row) => String(row.stock) },
    {
      key: "status",
      header: "Trạng thái",
      render: (row) =>
        row.stock <= filters.threshold ? (
          <span className="reports-status-low">Thấp</span>
        ) : (
          <span className="reports-status-ok">Ổn định</span>
        )
    }
  ];

  const handlePrintReport = () => {
    const bestRows = bestSelling
      .map(
        (item, index) => `
        <tr>
          <td class="num">${index + 1}</td>
          <td>${escapeHtmlText(item.name)}</td>
          <td class="num">${item.soldQty}</td>
        </tr>`
      )
      .join("");
    const lowRows = lowStock
      .map(
        (row) => `
        <tr>
          <td>${escapeHtmlText(row.ingredient)}</td>
          <td>${escapeHtmlText(row.unit)}</td>
          <td class="num">${row.stock}</td>
          <td>${row.stock <= filters.threshold ? "⚠️ Thấp" : "Ổn định"}</td>
        </tr>`
      )
      .join("");

    const html = `
      <div class="doc-header">
        <div class="doc-brand">DungCafe</div>
        <div class="doc-brand-tagline">Hệ thống quản lý quán cà phê</div>
        <div class="doc-title">Báo cáo kinh doanh</div>
        <p style="margin:6px 0 0;font-size:12px;color:#6c757d;">
          Ngày in: ${new Date().toLocaleString("vi-VN")} · Kỳ báo cáo: ${escapeHtmlText(filters.date)}
        </p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card"><p>Doanh thu trong ngày</p><h3>${formatCurrency(dailyRevenue)}</h3></div>
        <div class="kpi-card"><p>Top món bán chạy</p><h3>${bestSelling.length} món</h3></div>
        <div class="kpi-card"><p>NL tồn thấp</p><h3>${lowStock.length} mặt</h3></div>
      </div>

      <div class="doc-section">
        <div class="doc-section-title">Món bán chạy (Top ${filters.top})</div>
        <table>
          <thead>
            <tr>
              <th class="num" style="width:60px;">#</th>
              <th>Tên món</th>
              <th class="num">Số lượng bán</th>
            </tr>
          </thead>
          <tbody>${bestRows || `<tr><td colspan="3" style="text-align:center;color:#888;">Không có dữ liệu</td></tr>`}</tbody>
        </table>
      </div>

      <div class="doc-section">
        <div class="doc-section-title">Nguyên liệu sắp hết (ngưỡng ≤ ${filters.threshold})</div>
        <table>
          <thead>
            <tr>
              <th>Nguyên liệu</th>
              <th>Đơn vị</th>
              <th class="num">Tồn hiện tại</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>${lowRows || `<tr><td colspan="4" style="text-align:center;color:#888;">Không có nguyên liệu tồn thấp</td></tr>`}</tbody>
        </table>
      </div>

      <div class="doc-footer">
        Báo cáo được xuất tự động từ hệ thống DungCafe.
      </div>
    `;
    openPrintWindow(html, `BaoCao-${filters.date}`);
  };

  return (
    <div className="module-page reports-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Trung tâm báo cáo</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Báo cáo</p>
        </div>
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={handlePrintReport}>
            {React.createElement(MdPrint as any, { size: 18, style: { marginRight: 6, verticalAlign: "middle" } })}
            In báo cáo
          </AppButton>
          <AppButton onClick={() => setOpenFilter(true)}>Bộ lọc</AppButton>
        </div>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="reports-kpi-grid">
        <article className="module-card reports-kpi-card">
          <p>Doanh thu theo ngày</p>
          <h3>{formatCurrency(dailyRevenue)}</h3>
          <small>Ngày: {filters.date}</small>
        </article>
        <article className="module-card reports-kpi-card">
          <p>Số món bán chạy</p>
          <h3>{bestSelling.length}</h3>
          <small>Top = {filters.top}</small>
        </article>
        <article className="module-card reports-kpi-card">
          <p>Mặt hàng sắp hết</p>
          <h3>{lowStock.length}</h3>
          <small>Ngưỡng = {filters.threshold}</small>
        </article>
      </section>

      <section className="module-card">
        <h3 className="panel-title">Món bán chạy</h3>
        <div className="reports-best-grid">
          {bestSelling.map((item) => (
            <article key={item.id} className="reports-best-item">
              <p>{item.name}</p>
              <span>Đã bán: {item.soldQty}</span>
            </article>
          ))}
          {bestSelling.length === 0 ? <p>Không có dữ liệu.</p> : null}
        </div>
      </section>

      <section className="module-card">
        <div className="module-toolbar">
          <h3 className="panel-title">Nguyên liệu sắp hết</h3>
          <input
            className="module-search"
            placeholder="Tìm kiếm nguyên liệu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <DataTable
          columns={lowStockColumns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText={loading ? "Đang tải..." : "Không có dữ liệu tồn kho thấp."}
        />

        <div className="module-pagination">
          <span>Trang {currentPage}/{totalPages}</span>
          <div className="module-pagination-actions">
            <AppButton variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Trước</AppButton>
            <AppButton variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Sau</AppButton>
          </div>
        </div>
      </section>

      <AppModal open={openFilter} title="Bộ lọc báo cáo" onClose={() => setOpenFilter(false)}>
        <form className="form-grid" onSubmit={handleApplyFilter}>
          <label className="form-field">
            <span>Ngày</span>
            <input
              type="date"
              value={filters.date}
              onChange={(event) =>
                setFilters((previous) => ({ ...previous, date: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Top món bán chạy</span>
            <input
              type="number"
              min={1}
              value={filters.top}
              onChange={(event) =>
                setFilters((previous) => ({ ...previous, top: Number(event.target.value) }))
              }
              required
            />
          </label>
          <label className="form-field form-field-span">
            <span>Ngưỡng tồn kho thấp</span>
            <input
              type="number"
              min={1}
              value={filters.threshold}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  threshold: Number(event.target.value)
                }))
              }
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Áp dụng</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setOpenFilter(false)}>
              Hủy
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default ReportsPage;
