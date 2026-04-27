import { formatCurrency } from "../utils/formatCurrency";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import useEmployees, { EmployeeRow } from "../hooks/useEmployees";
import "../assets/styles/employees.css";

const EmployeesPage = () => {
  usePageTitle("Nhân viên | Coffee Management System");

  const {
    employees: pagedRows,
    availableUsers,
    search, setSearch,
    page, setPage,
    currentPage, totalPages,
    error, success, loading,
    openModal, setOpenModal,
    editingEmployee,
    form, setForm,
    loadEmployees,
    openCreateModal, openEditModal,
    handleSubmit, handleDelete
  } = useEmployees();

  const columns: DataColumn<EmployeeRow>[] = [
    { key: "name", header: "Họ tên", render: (row) => row.name },
    {
      key: "gender",
      header: "Giới tính",
      render: (row) => row.gender || "-"
    },
    {
      key: "birthDate",
      header: "Ngày sinh",
      render: (row) => {
        if (!row.birthDate) return "-";
        const d = new Date(row.birthDate);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("vi-VN");
      }
    },
    {
      key: "role",
      header: "Chức vụ",
      render: (row) => row.role ? (
        <span className="inline-status">{row.role}</span>
      ) : "-"
    },
    {
      key: "salary",
      header: "Lương",
      render: (row) => row.salary ? formatCurrency(row.salary) : "-"
    },
    { key: "phone", header: "Số điện thoại", render: (row) => row.phone || "-" },
    { key: "address", header: "Địa chỉ", render: (row) => row.address || "-" },
    {
      key: "actions",
      header: "Thao tác",
      render: (row) => (
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={() => openEditModal(row)}>
            Sửa
          </AppButton>
          <AppButton variant="danger" onClick={() => void handleDelete(row.id)}>
            Xóa
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page employees-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Quản lý nhân viên</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Nhân viên</p>
        </div>
        <AppButton onClick={openCreateModal}>Thêm nhân viên</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}
      {success ? <p className="alert-success">{success}</p> : null}

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, số điện thoại, mã người dùng"
          />
          <AppButton variant="ghost" onClick={() => void loadEmployees()} disabled={loading}>
              {loading ? "Đang tải..." : "Làm mới"}
            </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="Không tìm thấy nhân viên."
        />

        <div className="module-pagination">
          <span>Trang {currentPage}/{totalPages}</span>
          <div className="module-pagination-actions">
            <AppButton variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Trước</AppButton>
            <AppButton variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Sau</AppButton>
          </div>
        </div>
      </section>

      <AppModal
        open={openModal}
        title={editingEmployee ? "Sửa nhân viên" : "Tạo nhân viên"}
        onClose={() => setOpenModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          {!editingEmployee ? (
            <label className="form-field form-field-span">
              <span>Tài khoản liên kết <small style={{ color: "#6c757d" }}>(có thể bỏ trống, gán sau)</small></span>
              <select
                value={form.userId}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, userId: event.target.value }))
                }
              >
                <option value="">-- Chưa gán tài khoản --</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="form-field">
            <span>Họ và tên</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              placeholder="Nhập họ và tên nhân viên..."
              required
            />
          </label>
          <label className="form-field">
            <span>Số điện thoại</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, phone: event.target.value }))
              }
              placeholder="VD: 0123456789"
              required
            />
          </label>
          <label className="form-field">
            <span>Giới tính</span>
            <select
              value={form.gender}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, gender: event.target.value }))
              }
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </label>
          <label className="form-field">
            <span>Ngày sinh</span>
            <input
              type="date"
              value={form.birthDate}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, birthDate: event.target.value }))
              }
            />
          </label>
          <label className="form-field">
            <span>Chức vụ</span>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, role: event.target.value }))
              }
            >
              <option value="">-- Chọn chức vụ --</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Thu ngân">Thu ngân</option>
              <option value="Pha chế">Pha chế</option>
              <option value="Phục vụ">Phục vụ</option>
            </select>
          </label>
          <label className="form-field">
            <span>Lương (VNĐ)</span>
            <input
              type="number"
              min={0}
              value={form.salary}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, salary: event.target.value }))
              }
              placeholder="VD: 8000000"
            />
          </label>
          <label className="form-field form-field-span">
            <span>Địa chỉ</span>
            <input
              value={form.address}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, address: event.target.value }))
              }
              placeholder="VD: TP.HCM"
            />
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

export default EmployeesPage;
