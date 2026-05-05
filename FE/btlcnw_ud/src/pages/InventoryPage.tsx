import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import useInventory, { IngredientRow } from "../hooks/useInventory";
import "../assets/styles/inventory.css";

const InventoryPage = () => {
  usePageTitle("Kho | Coffee Management System");

  const {
    ingredients: pagedRows,
    suppliers, supplierMap,
    search, setSearch,
    page, setPage, currentPage, totalPages,
    error, loading,
    createOpen, setCreateOpen,
    stockOpen, setStockOpen,
    stockMode,
    createForm, setCreateForm,
    stockForm, setStockForm,
    loadIngredients,
    handleCreate, handleDelete, openStockModal, handleUpdateStock
  } = useInventory();

  const columns: DataColumn<IngredientRow>[] = [
    { key: "name", header: "Nguyên liệu", render: (row) => row.name },
    { key: "unit", header: "Đơn vị", render: (row) => row.unit },
    { key: "qty", header: "Tồn kho", render: (row) => String(row.quantity) },
    {
      key: "supplier",
      header: "Nhà cung cấp",
      render: (row) => row.supplierName || supplierMap[row.supplierId] || "-"
    },
    {
      key: "actions",
      header: "Hành động",
      render: (row) => (
        <div className="module-row-actions">
          <AppButton variant="secondary" onClick={() => openStockModal(row.id.toString(), "import")}>
            Nhập
          </AppButton>
          <AppButton variant="secondary" onClick={() => openStockModal(row.id.toString(), "export")}>
            Xuất
          </AppButton>
          <AppButton variant="danger" onClick={() => void handleDelete(row.id.toString())}>
            Xóa
          </AppButton>
        </div>
      )
    }
  ];

  return (
    <div className="module-page inventory-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Quản lý kho</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Kho</p>
        </div>
        <AppButton onClick={() => setCreateOpen(true)}>Thêm nguyên liệu</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="module-card">
        <div className="module-toolbar">
          <input
            className="module-search"
            placeholder="Tìm kiếm nguyên liệu"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <AppButton variant="ghost" onClick={() => void loadIngredients()} disabled={loading}>
            {loading ? "Đang tải..." : "Làm mới"}
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          rows={pagedRows}
          rowKey={(row) => row.id}
          emptyText="Không tìm thấy nguyên liệu."
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
        open={createOpen}
        title="Thêm nguyên liệu"
        onClose={() => setCreateOpen(false)}
      >
        <form className="form-grid" onSubmit={handleCreate}>
          <label className="form-field">
            <span>Tên nguyên liệu</span>
            <input
              value={createForm.name}
              onChange={(event) =>
                setCreateForm((previous) => ({ ...previous, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Đơn vị</span>
            <input
              value={createForm.unit}
              onChange={(event) =>
                setCreateForm((previous) => ({ ...previous, unit: event.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            <span>Số lượng tồn trong kho</span>
            <input
              type="number"
              min={0}
              value={createForm.stockQuantity}
              onChange={(event) =>
                setCreateForm((previous) => ({
                  ...previous,
                  stockQuantity: Number(event.target.value)
                }))
              }
            />
          </label>
          <label className="form-field">
            <span>Nhà cung cấp</span>
            <select
              value={createForm.supplierId}
              onChange={(event) =>
                setCreateForm((previous) => ({
                  ...previous,
                  supplierId: event.target.value
                }))
              }
              required
            >
              <option value="">-- Vui lòng chọn nhà cung cấp --</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </label>

          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Lưu</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              Hủy
            </AppButton>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={stockOpen}
        title={stockMode === "import" ? "Nhập kho" : "Xuất kho"}
        onClose={() => setStockOpen(false)}
      >
        <form className="form-grid" onSubmit={handleUpdateStock}>
          <label className="form-field form-field-span">
            <span>Số lượng</span>
            <input
              type="number"
              min={1}
              value={stockForm.quantity}
              onChange={(event) =>
                setStockForm({ quantity: Number(event.target.value) })
              }
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">Xác nhận</AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setStockOpen(false)}>
              Hủy
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default InventoryPage;
