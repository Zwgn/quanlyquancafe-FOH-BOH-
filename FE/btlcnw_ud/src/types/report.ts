export interface BestSellerRow {
  rank: number;
  name: string;
  quantity: number;
  revenue: number;
}

export interface LowStockRow {
  id: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface ReportFilters {
  date: string;
  top: number;
  threshold: number;
}
