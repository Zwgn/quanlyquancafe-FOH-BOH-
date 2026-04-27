import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getBestSellingItems,
  getDailyRevenue,
  getLowStockIngredients
} from "../services/reportsService";
import { getApiErrorMessage } from "../utils/apiError";

export interface BestSellerRow {
  id: string;
  name: string;
  soldQty: number;
}

export interface LowStockRow {
  id: string;
  ingredient: string;
  unit: string;
  stock: number;
}

export interface ReportFilters {
  date: string;
  top: number;
  threshold: number;
}

const PAGE_SIZE = 8;
const today = new Date().toISOString().slice(0, 10);

const useReports = () => {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [bestSelling, setBestSelling] = useState<BestSellerRow[]>([]);
  const [lowStock, setLowStock] = useState<LowStockRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({ date: today, top: 10, threshold: 100 });
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    const errors: string[] = [];

    try {
      const daily = await getDailyRevenue(filters.date);
      const dailyRecord = (daily ?? {}) as Record<string, unknown>;
      setDailyRevenue(
        Number(
          dailyRecord.totalRevenue ?? dailyRecord.TotalRevenue ??
          dailyRecord.revenue ?? dailyRecord.Revenue ?? 0
        )
      );
    } catch (err) {
      errors.push(getApiErrorMessage(err, "Không tải được doanh thu."));
    }

    try {
      const best = await getBestSellingItems(filters.top);
      setBestSelling(
        best.map((item, index) => {
          const row = item as Record<string, unknown>;
          return {
            id: String(row.id ?? row.Id ?? row.menuItemId ?? row.MenuItemId ?? index),
            name: String(row.name ?? row.Name ?? "Không xác định"),
            soldQty: Number(
              row.totalSold ?? row.TotalSold ?? row.soldQty ?? row.SoldQty ??
              row.quantity ?? row.Quantity ?? 0
            )
          };
        })
      );
    } catch (err) {
      errors.push(getApiErrorMessage(err, "Không tải được món bán chạy."));
    }

    try {
      const low = await getLowStockIngredients(filters.threshold);
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
    } catch (err) {
      errors.push(getApiErrorMessage(err, "Không tải được nguyên liệu sắp hết."));
    }

    if (errors.length > 0) setError(errors.join(" "));
    setLoading(false);
  };

  useEffect(() => {
    void loadReports();
  }, [filters.date, filters.threshold, filters.top]);

  const filteredLowStock = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return lowStock;
    return lowStock.filter((item) =>
      [item.ingredient, item.unit, item.stock].join(" ").toLowerCase().includes(keyword)
    );
  }, [lowStock, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLowStock.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filteredLowStock.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleApplyFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenFilter(false);
  };

  return {
    dailyRevenue,
    bestSelling,
    lowStock,
    lowStockPaged: pagedRows,
    filters, setFilters,
    search, setSearch: (v: string) => { setSearch(v); setPage(1); },
    page, setPage, currentPage, totalPages,
    error, loading,
    openFilter, setOpenFilter,
    handleApplyFilter,
    loadReports
  };
};

export default useReports;
