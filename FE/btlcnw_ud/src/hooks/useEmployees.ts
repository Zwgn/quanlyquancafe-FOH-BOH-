import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createNewEmployee,
  deleteExistingEmployee,
  getEmployeesList,
  updateExistingEmployee
} from "../services/employeesService";
import { getUsers, resetUserPassword } from "../api/usersApi";
import { useConfirm } from "../components/ui/ConfirmDialog";
import { getApiErrorMessage } from "../utils/apiError";

export interface AvailableUser {
  id: string;
  username: string;
  role: string;
}

export interface EmployeeRow {
  id: string;
  userId: string;
  name: string;
  phone: string;
  gender: string;
  birthDate: string;
  role: string;
  salary: number;
  address: string;
}

export interface EmployeeForm {
  userId: string;
  name: string;
  phone: string;
  gender: string;
  birthDate: string;
  role: string;
  salary: string;
  address: string;
}

const PAGE_SIZE = 8;
const DEFAULT_RESET_PASSWORD = "123456";

const mapEmployee = (input: unknown, index: number): EmployeeRow => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? row.employeeId ?? row.EmployeeId ?? index),
    userId: String(row.userId ?? row.UserId ?? "-"),
    name: String(row.name ?? row.Name ?? ""),
    phone: String(row.phone ?? row.Phone ?? ""),
    gender: String(row.gender ?? row.Gender ?? ""),
    birthDate: String(row.birthDate ?? row.BirthDate ?? ""),
    role: String(row.role ?? row.Role ?? ""),
    salary: Number(row.salary ?? row.Salary ?? 0),
    address: String(row.address ?? row.Address ?? "")
  };
};

const emptyForm = (): EmployeeForm => ({
  userId: "", name: "", phone: "",
  gender: "", birthDate: "", role: "", salary: "", address: ""
});

const useEmployees = () => {
  const confirm = useConfirm();

  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRow | null>(null);
  const [form, setForm] = useState<EmployeeForm>(emptyForm());

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const [empResponse, userResponse] = await Promise.all([
        getEmployeesList(),
        getUsers().catch(() => [])
      ]);
      const mapped = empResponse.map(mapEmployee);
      setEmployees(mapped);

      const usedUserIds = new Set(mapped.map((e) => e.userId).filter((id) => id && id !== "-"));
      const available = (userResponse as unknown[]).map((u) => {
        const row = (u ?? {}) as Record<string, unknown>;
        return {
          id: String(row.id ?? row.Id ?? ""),
          username: String(row.username ?? row.Username ?? ""),
          role: String(row.role ?? row.Role ?? "")
        };
      }).filter((u) => u.id && !usedUserIds.has(u.id));
      setAvailableUsers(available);
    } catch (err) {
      setError(getApiErrorMessage(err, "Không tải được danh sách nhân viên.", {
        403: "Bạn không có quyền truy cập mục Nhân viên. Chỉ tài khoản quản trị viên được phép.",
        401: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return employees;
    return employees.filter((item) =>
      [item.name, item.phone, item.userId].join(" ").toLowerCase().includes(keyword)
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreateModal = () => {
    setEditingEmployee(null);
    setForm(emptyForm());
    setOpenModal(true);
  };

  const openEditModal = (employee: EmployeeRow) => {
    setEditingEmployee(employee);
    setForm({
      userId: employee.userId,
      name: employee.name,
      phone: employee.phone,
      gender: employee.gender,
      birthDate: employee.birthDate ? employee.birthDate.slice(0, 10) : "",
      role: employee.role,
      salary: employee.salary ? String(employee.salary) : "",
      address: employee.address
    });
    setOpenModal(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Tên và số điện thoại là bắt buộc.");
      return;
    }
    try {
      if (editingEmployee) {
        await updateExistingEmployee(editingEmployee.id, {
          name: form.name.trim(),
          phone: form.phone.trim(),
          gender: form.gender || undefined,
          birthDate: form.birthDate || undefined,
          role: form.role || undefined,
          salary: form.salary ? Number(form.salary) : null,
          address: form.address.trim() || undefined
        });
      } else {
        await createNewEmployee({
          userId: form.userId.trim() || undefined,
          name: form.name.trim(),
          phone: form.phone.trim(),
          gender: form.gender || undefined,
          birthDate: form.birthDate || undefined,
          role: form.role || undefined,
          salary: form.salary ? Number(form.salary) : null,
          address: form.address.trim() || undefined
        });
      }
      setOpenModal(false);
      await loadEmployees();
    } catch (err) {
      setError(getApiErrorMessage(err, "Không lưu được nhân viên."));
    }
  };

  const handleResetPassword = async (employee: EmployeeRow) => {
    if (!employee.userId || employee.userId === "-") {
      setError("Nhân viên này chưa liên kết với tài khoản người dùng.");
      return;
    }
    const ok = await confirm({
      title: "Đặt lại mật khẩu",
      message: `Đặt lại mật khẩu của "${employee.name}" về mặc định "${DEFAULT_RESET_PASSWORD}"?`,
      confirmText: "Đặt lại",
      tone: "warning"
    });
    if (!ok) return;
    try {
      setError(null);
      setSuccess(null);
      setResettingId(employee.id);
      await resetUserPassword(employee.userId, DEFAULT_RESET_PASSWORD);
      setSuccess(`Đã đặt lại mật khẩu của "${employee.name}" về "${DEFAULT_RESET_PASSWORD}".`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Đặt lại mật khẩu thất bại."));
    } finally {
      setResettingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Xóa nhân viên",
      message: "Bạn có chắc chắn muốn xóa nhân viên này?",
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      await deleteExistingEmployee(id);
      await loadEmployees();
    } catch (err) {
      setError(getApiErrorMessage(err, "Xóa nhân viên thất bại."));
    }
  };

  return {
    employees: pagedRows,
    availableUsers,
    search, setSearch: (v: string) => { setSearch(v); setPage(1); },
    page, setPage,
    currentPage, totalPages,
    error, success, loading, resettingId,
    openModal, setOpenModal,
    editingEmployee,
    form, setForm,
    loadEmployees,
    openCreateModal, openEditModal,
    handleSubmit, handleResetPassword, handleDelete
  };
};

export default useEmployees;
