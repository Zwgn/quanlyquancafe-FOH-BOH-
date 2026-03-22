import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createNewTable,
  getTablesList,
  updateExistingTable,
  updateExistingTableStatus
} from "../services/tablesService";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import "../assets/styles/tables.css";

interface TableRow {
  id: string;
  name: string;
  capacity: number;
  status: string;
}

const PAGE_SIZE = 8;

const mapTable = (input: unknown, index: number): TableRow => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.tableId ?? row.TableId ?? index),
    name: String(row.name ?? row.Name ?? `Table ${index + 1}`),
    capacity: Number(row.capacity ?? row.Capacity ?? 0),
    status: String(row.status ?? row.Status ?? "Available")
  };
};

const TablesPage = () => {
  usePageTitle("Tables | DungCafe Admin");

  const [tables, setTables] = useState<TableRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableRow | null>(null);
  const [form, setForm] = useState({ name: "", capacity: 2 });

  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTablesList();
      setTables(response.map(mapTable));
    } catch {
      setError("Không tải được danh sách bàn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTables();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return tables;
    }

    return tables.filter((item) =>
      [item.name, item.status, item.capacity].join(" ").toLowerCase().includes(keyword)
    );
  }, [tables, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openCreate = () => {
    setEditingTable(null);
    setForm({ name: "", capacity: 2 });
    setModalOpen(true);
  };

  const openEdit = (table: TableRow) => {
    setEditingTable(table);
    setForm({ name: table.name, capacity: table.capacity });
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || form.capacity <= 0) {
      setError("Tên bàn và sức chứa không hợp lệ.");
      return;
    }

    try {
      if (editingTable) {
        await updateExistingTable(editingTable.id, {
          name: form.name.trim(),
          capacity: Number(form.capacity)
        });
      } else {
        await createNewTable({ name: form.name.trim(), capacity: Number(form.capacity) });
      }
      setModalOpen(false);
      await loadTables();
    } catch {
      setError("Lưu bàn thất bại.");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateExistingTableStatus(id, status);
      await loadTables();
    } catch {
      setError("Cập nhật trạng thái bàn thất bại.");
    }
  };

  const columns: DataColumn<TableRow>[] = [
    { key: "name", header: "Table", render: (row) => row.name },
    { key: "capacity", header: "Capacity", render: (row) => String(row.capacity) },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(event) => void handleStatusChange(row.id, event.target.value)}
        >
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Reserved">Reserved</option>
          <option value="Cleaning">Cleaning</option>
        </select>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={() => openEdit(row)}>
            Edit
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page tables-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Tables Management</h2>
          <p className="module-breadcrumb">Dashboard / Tables</p>
        </div>
        <AppButton onClick={openCreate}>Add Table</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by table name or status"
          />
          <AppButton variant="ghost" onClick={() => void loadTables()} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="No table found."
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

      <AppModal
        open={modalOpen}
        title={editingTable ? "Edit Table" : "Create Table"}
        onClose={() => setModalOpen(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Table Name</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Capacity</span>
            <input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, capacity: Number(event.target.value) }))
              }
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Save</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default TablesPage;
