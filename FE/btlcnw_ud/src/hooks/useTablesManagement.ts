import { useEffect, useMemo, useState } from "react";
import {
  createNewTable,
  getTablesList,
  updateExistingTable,
  updateExistingTableStatus
} from "../services/tablesService";

export interface TableRow {
  id: string;
  name: string;
  capacity: number;
  status: string;
}

interface TableFormState {
  name: string;
  capacity: number;
}

const PAGE_SIZE = 8;

export const TABLE_STATUS_OPTIONS = [
  { value: "Available", label: "Trống" },
  { value: "Occupied", label: "Đang phục vụ" },
  { value: "Reserved", label: "Đã đặt" },
  { value: "Cleaning", label: "Đang dọn" }
];

const STATUS_LABEL_MAP: Record<string, string> = TABLE_STATUS_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {}
);

const EMPTY_FORM: TableFormState = {
  name: "",
  capacity: 2
};

const mapTable = (input: unknown, index: number): TableRow => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.tableId ?? row.TableId ?? index + 1),
    name: String(row.name ?? row.Name ?? `Bàn ${index + 1}`),
    capacity: Number(row.capacity ?? row.Capacity ?? 0),
    status: String(row.status ?? row.Status ?? "Available")
  };
};

export const useTablesManagement = () => {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [detailRow, setDetailRow] = useState<TableRow | null>(null);
  const [editingRow, setEditingRow] = useState<TableRow | null>(null);
  const [form, setForm] = useState<TableFormState>(EMPTY_FORM);

  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTablesList();
      setRows(response.map(mapTable));
    } catch {
      setError("Không tải được danh sách bàn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTables();
  }, []);

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesKeyword =
        !keyword ||
        [row.name, String(row.capacity), STATUS_LABEL_MAP[row.status] ?? row.status]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus = statusFilter === "all" || row.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const tableStats = useMemo(
    () => ({
      available: rows.filter((row) => row.status === "Available").length,
      occupied: rows.filter((row) => row.status === "Occupied").length,
      reserved: rows.filter((row) => row.status === "Reserved").length,
      total: rows.length
    }),
    [rows]
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openCreateModal = () => {
    setEditingRow(null);
    setForm(EMPTY_FORM);
    setOpenModal(true);
  };

  const openEditModal = (row: TableRow) => {
    setEditingRow(row);
    setForm({ name: row.name, capacity: row.capacity });
    setOpenModal(true);
  };

  const handleSaveTable = async () => {
    if (!form.name.trim() || form.capacity < 1) {
      setError("Tên bàn và sức chứa không hợp lệ.");
      return;
    }

    try {
      setError(null);

      if (editingRow) {
        await updateExistingTable(editingRow.id, {
          name: form.name.trim(),
          capacity: Number(form.capacity)
        });
      } else {
        await createNewTable({
          name: form.name.trim(),
          capacity: Number(form.capacity)
        });
      }

      setOpenModal(false);
      await loadTables();
    } catch {
      setError("Lưu thông tin bàn thất bại.");
    }
  };

  const openTableDetail = (row: TableRow) => {
    setDetailRow(row);
    setOpenDetailModal(true);
  };

  const openEditFromDetail = () => {
    if (detailRow) {
      setOpenDetailModal(false);
      openEditModal(detailRow);
    }
  };

  const getStatusLabel = (status: string) => STATUS_LABEL_MAP[status] ?? status;

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setError(null);
      await updateExistingTableStatus(id, status);
      await loadTables();
    } catch {
      setError("Cập nhật trạng thái bàn thất bại.");
    }
  };

  return {
    rows: pagedRows,
    tableStats,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    currentPage,
    totalPages,
    openModal,
    setOpenModal,
    openDetailModal,
    setOpenDetailModal,
    detailRow,
    editingRow,
    form,
    setForm,
    loading,
    error,
    loadTables,
    openCreateModal,
    openEditModal,
    openTableDetail,
    openEditFromDetail,
    getStatusLabel,
    handleSaveTable,
    handleStatusChange,
    statusOptions: TABLE_STATUS_OPTIONS
  };
};