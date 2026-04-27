import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import useUsers, { UserRow } from "../hooks/useUsers";

const formatDate = (value: string) => {
  if (!value || value === "undefined") return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN");
};

const ROLE_COLORS: Record<string, string> = {
  admin: "#6f4e37",
  "quản lý": "#6f4e37",
  "nhân viên": "#1d6f42",
  "thu ngân": "#1d6f42",
  "pha chế": "#0e5a9e",
  "phục vụ": "#7c5c0e"
};

const RoleBadge = ({ role }: { role: string }) => {
  const color = ROLE_COLORS[role.toLowerCase()] ?? "#6c757d";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: `${color}18`,
        color,
        border: `1px solid ${color}40`
      }}
    >
      {role}
    </span>
  );
};

const UsersPage = () => {
  usePageTitle("Tài khoản | Coffee Management System");

  const {
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
  } = useUsers();

  const columns: DataColumn<UserRow>[] = [
    {
      key: "username",
      header: "Tên đăng nhập",
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{row.username}</span>
      )
    },
    {
      key: "role",
      header: "Vai trò",
      render: (row) => <RoleBadge role={row.role} />
    },
    {
      key: "employee",
      header: "Nhân viên liên kết",
      render: (row) =>
        row.employeeName ? (
          <span style={{ fontWeight: 500 }}>{row.employeeName}</span>
        ) : (
          <span style={{ color: "#adb5bd", fontSize: 13 }}>Chưa liên kết</span>
        )
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (row) => formatDate(row.createdAt)
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (row) => (
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={() => openEditModal(row)}>
            Sửa
          </AppButton>
          <AppButton
            variant="ghost"
            onClick={() => void handleResetPassword(row)}
            disabled={resettingId === row.id}
          >
            {resettingId === row.id ? "Đang reset..." : "Reset PW"}
          </AppButton>
          <AppButton variant="danger" onClick={() => void handleDelete(row)}>
            Xóa
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Quản lý tài khoản</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Tài khoản</p>
        </div>
        <AppButton onClick={openCreateModal}>Thêm tài khoản</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}
      {success ? <p className="alert-success">{success}</p> : null}

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên đăng nhập, vai trò..."
          />
          <AppButton variant="ghost" onClick={() => void loadUsers()} disabled={loading}>
            {loading ? "Đang tải..." : "Làm mới"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="Không tìm thấy tài khoản nào."
        />

        <div className="module-pagination">
          <span>Trang {currentPage}/{totalPages}</span>
          <div className="module-pagination-actions">
            <AppButton
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </AppButton>
            <AppButton
              variant="secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </AppButton>
          </div>
        </div>
      </section>

      <AppModal
        open={openModal}
        title={editingUser ? "Sửa tài khoản" : "Tạo tài khoản"}
        onClose={() => setOpenModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field form-field-span">
            <span>Tên đăng nhập</span>
            <input
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="Nhập tên đăng nhập..."
              autoComplete="off"
              required
            />
          </label>

          {!editingUser ? (
            <label className="form-field form-field-span">
              <span>Mật khẩu</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Nhập mật khẩu..."
                autoComplete="new-password"
                required
              />
            </label>
          ) : (
            <label className="form-field form-field-span">
              <span>Mật khẩu mới <small style={{ color: "#6c757d" }}>(để trống nếu không đổi)</small></span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Để trống nếu không đổi mật khẩu"
                autoComplete="new-password"
              />
            </label>
          )}

          <label className="form-field form-field-span">
            <span>Vai trò</span>
            <select
              value={form.roleId}
              onChange={(e) => setForm((p) => ({ ...p, roleId: e.target.value }))}
              required
            >
              <option value="">-- Chọn vai trò --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Lưu</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setOpenModal(false)}>
              Hủy
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default UsersPage;
