import { useEffect, useMemo, useState } from "react";
import { getPayments } from "../api/paymentsApi";
import { getApiErrorMessage } from "../utils/apiError";

export interface PaymentRow {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  paidAt: string;
  tableName: string;
  employeeName: string;
}

const PAGE_SIZE = 10;

const mapPayment = (input: unknown, index: number): PaymentRow => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? index),
    orderId: String(row.orderId ?? row.OrderId ?? ""),
    amount: Number(row.amount ?? row.Amount ?? 0),
    paymentMethod: String(row.paymentMethod ?? row.PaymentMethod ?? ""),
    paidAt: String(row.paidAt ?? row.PaidAt ?? ""),
    tableName: String(row.tableName ?? row.TableName ?? "-"),
    employeeName: String(row.employeeName ?? row.EmployeeName ?? "-")
  };
};

export const translatePaymentMethod = (method: string) => {
  const normalized = method.trim().toLowerCase();
  if (normalized === "cash") return "Tiền mặt";
  if (normalized === "card") return "Thẻ";
  if (normalized === "ewallet" || normalized === "e-wallet" || normalized === "online") return "Thanh toán online";
  return method || "-";
};

const usePayments = () => {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPayments();
      setPayments(response.map(mapPayment));
    } catch (err) {
      setError(getApiErrorMessage(err, "Không tải được lịch sử thanh toán."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPayments();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return payments.filter((item) => {
      const matchKeyword =
        !keyword ||
        [item.orderId, item.tableName, item.employeeName, item.paymentMethod]
          .join(" ").toLowerCase().includes(keyword);
      const matchDate =
        !filterDate ||
        (item.paidAt && new Date(item.paidAt).toISOString().slice(0, 10) === filterDate);
      return matchKeyword && matchDate;
    });
  }, [payments, search, filterDate]);

  const totalRevenue = useMemo(
    () => filtered.reduce((sum, item) => sum + item.amount, 0),
    [filtered]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return {
    payments: pagedRows,
    filteredCount: filtered.length,
    totalRevenue,
    search, setSearch: (v: string) => { setSearch(v); setPage(1); },
    filterDate, setFilterDate: (v: string) => { setFilterDate(v); setPage(1); },
    page, setPage, currentPage, totalPages,
    error, loading,
    loadPayments
  };
};

export default usePayments;
