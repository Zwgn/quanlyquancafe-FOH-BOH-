import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getBestSellingItems,
  getDailyRevenue,
  getLowStockIngredients
} from "../services/reportsService";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatCurrency } from "../utils/formatCurrency";
import "../assets/styles/reports.css";

interface BestSellerRow {
  id: string;
  name: string;
  soldQty: number;
}

interface LowStockRow {
  id: string;
  ingredient: string;
  unit: string;
  stock: number;
}

const PAGE_SIZE = 8;

const today = new Date().toISOString().slice(0, 10);

const ReportsPage = () => {
  usePageTitle("Reports | DungCafe Admin");

  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [bestSelling, setBestSelling] = useState<BestSellerRow[]>([]);
  const [lowStock, setLowStock] = useState<LowStockRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({ date: today, top: 10, threshold: 100 });
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const [daily, best, low] = await Promise.all([
        getDailyRevenue(filters.date),
        getBestSellingItems(filters.top),
        getLowStockIngredients(filters.threshold)
      ]);

      const dailyRecord = (daily ?? {}) as Record<string, unknown>;
      setDailyRevenue(
        Number(
          dailyRecord.totalRevenue ??
            dailyRecord.TotalRevenue ??
            dailyRecord.revenue ??
            dailyRecord.Revenue ??
            0
        )
      );

      setBestSelling(
        best.map((item, index) => {
          const row = item as Record<string, unknown>;
          return {
            id: String(row.id ?? row.Id ?? row.menuItemId ?? row.MenuItemId ?? index),
            name: String(row.name ?? row.Name ?? "Unknown"),
            soldQty: Number(row.soldQty ?? row.SoldQty ?? row.quantity ?? row.Quantity ?? 0)
          };
        })
      );

      setLowStock(
        low.map((item, index) => {
          const row = item as Record<string, unknown>;
          return {
            id: String(row.id ?? row.Id ?? row.ingredientId ?? row.IngredientId ?? index),
            ingredient: String(row.name ?? row.Name ?? row.ingredientName ?? row.IngredientName ?? ""),
            unit: String(row.unit ?? row.Unit ?? ""),
            stock: Number(row.stockQuantity ?? row.StockQuantity ?? row.quantity ?? row.Quantity ?? 0)
          };
        })
      );
    } catch {
      setError("Không tải được dữ liệu báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
  }, [filters.date, filters.threshold, filters.top]);

  const filteredLowStock = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return lowStock;
    }

    return lowStock.filter((item) =>
      [item.ingredient, item.unit, item.stock].join(" ").toLowerCase().includes(keyword)
    );
  }, [lowStock, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLowStock.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filteredLowStock.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const lowStockColumns: DataColumn<LowStockRow>[] = [
    { key: "ingredient", header: "Ingredient", render: (row) => row.ingredient },
    { key: "unit", header: "Unit", render: (row) => row.unit },
    { key: "stock", header: "Current Stock", render: (row) => String(row.stock) },
    {
      key: "status",
      header: "Status",
      render: (row) =>
        row.stock <= filters.threshold ? (
          <span className="reports-status-low">Low</span>
        ) : (
          <span className="reports-status-ok">OK</span>
        )
    }
  ];

  const handleApplyFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenFilter(false);
  };

  return (
    <div className="module-page reports-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Reports Center</h2>
          <p className="module-breadcrumb">Dashboard / Reports</p>
        </div>
        <AppButton onClick={() => setOpenFilter(true)}>Filters</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="reports-kpi-grid">
        <article className="module-card reports-kpi-card">
          <p>Daily Revenue</p>
          <h3>{formatCurrency(dailyRevenue)}</h3>
          <small>Date: {filters.date}</small>
        </article>
        <article className="module-card reports-kpi-card">
          <p>Top Selling Count</p>
          <h3>{bestSelling.length}</h3>
          <small>Top = {filters.top}</small>
        </article>
        <article className="module-card reports-kpi-card">
          <p>Low Stock Items</p>
          <h3>{lowStock.length}</h3>
          <small>Threshold = {filters.threshold}</small>
        </article>
      </section>

      <section className="module-card">
        <h3 className="panel-title">Best Selling Items</h3>
        <div className="reports-best-grid">
          {bestSelling.map((item) => (
            <article key={item.id} className="reports-best-item">
              <p>{item.name}</p>
              <span>{item.soldQty} sold</span>
            </article>
          ))}
          {bestSelling.length === 0 ? <p>No data.</p> : null}
        </div>
      </section>

      <section className="module-card">
        <div className="module-toolbar">
          <h3 className="panel-title">Low Stock Ingredients</h3>
          <input
            className="module-search"
            placeholder="Search ingredient"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <DataTable
          columns={lowStockColumns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText={loading ? "Loading..." : "No low-stock data."}
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

      <AppModal open={openFilter} title="Report Filters" onClose={() => setOpenFilter(false)}>
        <form className="form-grid" onSubmit={handleApplyFilter}>
          <label className="form-field">
            <span>Date</span>
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
            <span>Top Best Sellers</span>
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
            <span>Low Stock Threshold</span>
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
            <AppButton type="submit">Apply</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setOpenFilter(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default ReportsPage;
