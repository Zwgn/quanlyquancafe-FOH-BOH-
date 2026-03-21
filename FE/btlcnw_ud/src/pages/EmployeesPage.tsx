import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createNewEmployee,
  deleteExistingEmployee,
  getEmployeesList,
  updateExistingEmployee
} from "../services/employeesService";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import "../assets/styles/employees.css";

interface EmployeeRow {
  id: string;
  userId: string;
  name: string;
  phone: string;
}

const PAGE_SIZE = 8;

const mapEmployee = (input: unknown, index: number): EmployeeRow => {
  const row = (input ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.Id ?? row.employeeId ?? row.EmployeeId ?? index),
    userId: String(row.userId ?? row.UserId ?? "-"),
    name: String(row.name ?? row.Name ?? ""),
    phone: String(row.phone ?? row.Phone ?? "")
  };
};

const EmployeesPage = () => {
  usePageTitle("Employees | DungCafe Admin");

  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRow | null>(null);
  const [form, setForm] = useState({ userId: "", name: "", phone: "" });

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployeesList();
      setEmployees(response.map(mapEmployee));
    } catch {
      setError("Khong tai duoc danh sach nhan vien.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return employees;
    }

    return employees.filter((item) =>
      [item.name, item.phone, item.userId].join(" ").toLowerCase().includes(keyword)
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openCreateModal = () => {
    setEditingEmployee(null);
    setForm({ userId: "", name: "", phone: "" });
    setOpenModal(true);
  };

  const openEditModal = (employee: EmployeeRow) => {
    setEditingEmployee(employee);
    setForm({ userId: employee.userId, name: employee.name, phone: employee.phone });
    setOpenModal(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Ten va so dien thoai la bat buoc.");
      return;
    }

    try {
      if (editingEmployee) {
        await updateExistingEmployee(editingEmployee.id, {
          name: form.name.trim(),
          phone: form.phone.trim()
        });
      } else {
        if (!form.userId.trim()) {
          setError("User ID la bat buoc khi tao nhan vien.");
          return;
        }

        await createNewEmployee({
          userId: form.userId.trim(),
          name: form.name.trim(),
          phone: form.phone.trim()
        });
      }

      setOpenModal(false);
      await loadEmployees();
    } catch {
      setError("Khong luu duoc nhan vien.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExistingEmployee(id);
      await loadEmployees();
    } catch {
      setError("Xoa nhan vien that bai.");
    }
  };

  const columns: DataColumn<EmployeeRow>[] = [
    { key: "name", header: "Name", render: (row) => row.name },
    { key: "phone", header: "Phone", render: (row) => row.phone },
    { key: "user", header: "User ID", render: (row) => row.userId },
    {
      key: "status",
      header: "Status",
      render: () => <span className="inline-status">Active</span>
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={() => openEditModal(row)}>
            Edit
          </AppButton>
          <AppButton variant="danger" onClick={() => void handleDelete(row.id)}>
            Delete
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page employees-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Employees Management</h2>
          <p className="module-breadcrumb">Dashboard / Employees</p>
        </div>
        <AppButton onClick={openCreateModal}>Add Employee</AppButton>
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
            placeholder="Search by name, phone, userId"
          />
          <AppButton variant="ghost" onClick={() => void loadEmployees()} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="No employee found."
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
        open={openModal}
        title={editingEmployee ? "Edit Employee" : "Create Employee"}
        onClose={() => setOpenModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          {!editingEmployee ? (
            <label className="form-field form-field-span">
              <span>User ID</span>
              <input
                value={form.userId}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, userId: event.target.value }))
                }
                required
              />
            </label>
          ) : null}
          <label className="form-field">
            <span>Name</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Phone</span>
            <input
              value={form.phone}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, phone: event.target.value }))
              }
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Save</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setOpenModal(false)}>
              Cancel
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default EmployeesPage;
