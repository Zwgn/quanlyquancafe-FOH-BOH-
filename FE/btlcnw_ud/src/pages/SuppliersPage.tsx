import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import useSuppliers, { SupplierRow } from "../hooks/useSuppliers";

const SuppliersPage = () => {
  usePageTitle("Nhà cung cấp | Coffee Management System");

  const {
    suppliers: pagedRows,
    search, setSearch,
    page, setPage,
    currentPage, totalPages,
    error, loading,
    openModal, setOpenModal,
    editingSupplier,
    form, setForm,
    loadSuppliers,
    openCreateModal, openEditModal,
    handleSubmit, handleDelete
  } = useSuppliers();

  const columns: DataColumn<SupplierRow>[] = [
    { key: "name", header: "Tên nhà cung cấp", render: (row) => row.name },
    { key: "phone", header: "Số điện thoại", render: (row) => row.phone },
    { key: "address", header: "Địa chỉ", render: (row) => row.address },
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
    <div className="module-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Nhà cung cấp</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Nhà cung cấp</p>
        </div>
        <AppButton onClick={openCreateModal}>+ Thêm nhà cung cấp</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            placeholder="Tìm kiếm theo tên, SĐT, địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AppButton variant="ghost" onClick={() => void loadSuppliers()} disabled={loading}>
            {loading ? "Đang tải..." : "Làm mới"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText={loading ? "Đang tải..." : "Không có nhà cung cấp."}
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
        title={editingSupplier ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}
        onClose={() => setOpenModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field form-field-span">
            <span>Tên nhà cung cấp</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              placeholder="VD: Công ty cà phê Trung Nguyên"
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
              placeholder="VD: 0901112222"
              required
            />
          </label>
          <label className="form-field">
            <span>Địa chỉ</span>
            <input
              value={form.address}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, address: event.target.value }))
              }
              placeholder="VD: TP.HCM"
              required
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

export default SuppliersPage;
