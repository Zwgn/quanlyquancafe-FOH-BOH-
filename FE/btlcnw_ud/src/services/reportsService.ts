import {
  getBestSellingItemsReport,
  getDailyRevenueReport,
  getLowStockIngredientsReport
} from "../api/reportsApi";

export const getDailyRevenue = async (date: string) =>
  getDailyRevenueReport(date);

export const getBestSellingItems = async (top: number) =>
  getBestSellingItemsReport(top);

export const getLowStockIngredients = async (threshold: number) =>
  getLowStockIngredientsReport(threshold);
