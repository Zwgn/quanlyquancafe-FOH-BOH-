import { FormEvent, useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, getUsers, resetUserPassword, updateUser } from "../api/usersApi";
import { getRoles } from "../api/rolesApi";
import { useConfirm } from "../components/ui/ConfirmDialog";
import { getApiErrorMessage } from "../utils/apiError";

export interface UserRow {
  id: string;
  username: string;
  roleId: string;
  role: string;
  employeeName: string;
  createdAt: string;
}

export interface RoleOption {
  id: string;
  name: string;
}

const DEFAULT_RESET_PASSWORD = "123456";
const PAGE_SIZE = 8;

const mapUser = (input: unknown, index: number): UserRow => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? index),
    username: String(row.username ?? row.Username ?? ""),
    roleId: String(row.roleId ?? row.RoleId ?? ""),
    role: String(row.role ?? row.Role ?? "-"),
    employeeName: String(row.employeeName ?? row.EmployeeName ?? ""),
    createdAt: String(row.createdAt ?? row.CreatedAt ?? "")
  };
};

const mapRole = (input: unknown, index: number): RoleOption => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? index),
    name: String(row.name ?? row.Name ?? "")
  };
};

const useUsers = () => {
  const confirm = useConfirm();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [search, setSearchRaw] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState({ username: "", password: "", roleId: "" });

  const setSearch = (v: string) => { setSearchRaw(v); setPage(1); };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers();
      setUsers(response.map(mapUser));
    } catch (err) {
      setError(getApiErrorMessage(err, "Không tải được danh sách tài khoản."));
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.map(mapRole));
    } catch {
      /* không block UI nếu roles lỗi */
    }
  };

  useEffect(() => {
    void Promise.all([loadUsers(), loadRoles()]);
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((u) =>
      [u.username, u.role].join(" ").toLowerCase().includes(keyword)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ username: "", password: "", roleId: roles[0]?.id ?? "" });
    setOpenModal(true);
  };

  const openEditModal = (user: UserRow) => {
    setEditingUser(user);
    setForm({ username: user.username, password: "", roleId: user.roleId });
    setOpenModal(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.username.trim() || !form.roleId.trim()) {
      setError("Tên đăng nhập và vai trò là bắt buộc.");
      return;
    }
    if (!editingUser && !form.password.trim()) {
      setError("Mật khẩu là bắt buộc khi tạo tài khoản mới.");
      return;
    }

    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          username: form.username.trim(),
          password: form.password.trim(),
          roleId: form.roleId
        });
      } else {
        await createUser({
          username: form.username.trim(),
          password: form.password.trim(),
          roleId: form.roleId
        });
      }
      setOpenModal(false);
      await loadUsers();
    } catch (err) {
      setError(getApiErrorMessage(err, "Không lưu được tài khoản."));
    }
  };

  const handleResetPassword = async (user: UserRow) => {
    const ok = await confirm({
      title: "Đặt lại mật khẩu",
      message: `Đặt lại mật khẩu của "${user.username}" về mặc định "${DEFAULT_RESET_PASSWORD}"?`,
      confirmText: "Đặt lại",
      tone: "warning"
    });
    if (!ok) return;
    try {
      setError(null);
      setSuccess(null);
      setResettingId(user.id);
      await resetUserPassword(user.id, DEFAULT_RESET_PASSWORD);
      setSuccess(`Đã đặt lại mật khẩu của "${user.username}" về "${DEFAULT_RESET_PASSWORD}".`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Đặt lại mật khẩu thất bại."));
    } finally {
      setResettingId(null);
    }
  };

  const handleDelete = async (user: UserRow) => {
    const ok = await confirm({
      title: "Xóa tài khoản",
      message: `Bạn có chắc chắn muốn xóa tài khoản "${user.username}"?`,
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      await deleteUser(user.id);
      await loadUsers();
    } catch (err) {
      setError(getApiErrorMessage(err, "Xóa tài khoản thất bại."));
    }
  };

  return {
    users: pagedRows,
    roles,
    search, setSearch,
    page, setPage, currentPage, totalPages,
    loading, resettingId,
    error, success,
    openModal, setOpenModal,
    editingUser,
    form, setForm,
    loadUsers,
    openCreateModal, openEditModal,
    handleSubmit, handleResetPassword, handleDelete
  };
};

export default useUsers;
