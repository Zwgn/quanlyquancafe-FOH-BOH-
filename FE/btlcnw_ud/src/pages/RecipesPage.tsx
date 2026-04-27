import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import DataTable, { DataColumn } from "../components/ui/DataTable";
import { usePageTitle } from "../hooks/usePageTitle";
import useRecipes, { RecipeRow } from "../hooks/useRecipes";
import { resolveImageUrl } from "../utils/imageUrl";

const RecipesPage = () => {
  usePageTitle("Công thức món | Coffee Management System");

  const {
    menuItems: filteredMenuItems,
    availableIngredients,
    selectedMenuItemId, setSelectedMenuItemId,
    selectedMenuItem,
    recipe,
    search, setSearch,
    error, loading,
    openModal, setOpenModal,
    editingRecipe,
    form, setForm,
    openCreateModal, openEditModal,
    handleSubmit, handleDelete
  } = useRecipes();

  const columns: DataColumn<RecipeRow>[] = [
    { key: "ingredient", header: "Nguyên liệu", render: (row) => row.ingredientName },
    {
      key: "quantity",
      header: "Định lượng / 1 phần",
      render: (row) => `${row.quantity} ${row.unit}`
    },
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
          <h2 className="module-title">Công thức món</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Công thức</p>
        </div>
        <AppButton onClick={openCreateModal} disabled={!selectedMenuItemId}>
          + Thêm nguyên liệu
        </AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <div
        className="module-card"
        style={{ display: "grid", gridTemplateColumns: "minmax(260px, 320px) 1fr", gap: 16 }}
      >
        <aside style={{ borderRight: "1px solid #eef0f3", paddingRight: 12 }}>
          <input
            className="module-search"
            placeholder="Tìm món..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <div style={{ maxHeight: 540, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {filteredMenuItems.length === 0 ? (
              <p style={{ color: "#888", fontSize: 14 }}>
                {loading ? "Đang tải..." : "Không có món."}
              </p>
            ) : (
              filteredMenuItems.map((item) => {
                const active = item.id === selectedMenuItemId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedMenuItemId(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: active ? "2px solid #6f4e37" : "1px solid #e5e7eb",
                      background: active ? "#fdf6f0" : "#fff",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    {item.imgUrl ? (
                      <img
                        src={resolveImageUrl(item.imgUrl)}
                        alt={item.name}
                        style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 6,
                          background: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        ☕
                      </div>
                    )}
                    <span style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}>
                      {item.name}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section>
          <div style={{ marginBottom: 12 }}>
            <h3 className="panel-title" style={{ margin: 0 }}>
              {selectedMenuItem ? `Công thức: ${selectedMenuItem.name}` : "Chọn một món để xem công thức"}
            </h3>
            {selectedMenuItem ? (
              <p style={{ margin: "4px 0 0", color: "#6c757d", fontSize: 13 }}>
                Tổng số nguyên liệu: <strong>{recipe.length}</strong>
              </p>
            ) : null}
          </div>

          <DataTable
            columns={columns}
            rows={recipe}
            rowKey={(row) => row.id}
            emptyText={
              selectedMenuItemId
                ? "Món này chưa có công thức. Hãy thêm nguyên liệu."
                : "Chọn một món bên trái để xem công thức."
            }
          />
        </section>
      </div>

      <AppModal
        open={openModal}
        title={editingRecipe ? "Sửa định lượng nguyên liệu" : "Thêm nguyên liệu vào công thức"}
        onClose={() => setOpenModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          {!editingRecipe ? (
            <label className="form-field form-field-span">
              <span>Nguyên liệu</span>
              <select
                value={form.ingredientId}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, ingredientId: event.target.value }))
                }
                required
              >
                <option value="">-- Chọn nguyên liệu --</option>
                {availableIngredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name} ({ing.unit})
                  </option>
                ))}
              </select>
              {availableIngredients.length === 0 ? (
                <small style={{ color: "#888" }}>
                  Tất cả nguyên liệu đã được thêm vào công thức này.
                </small>
              ) : null}
            </label>
          ) : (
            <label className="form-field form-field-span">
              <span>Nguyên liệu</span>
              <input value={editingRecipe.ingredientName} disabled />
            </label>
          )}

          <label className="form-field form-field-span">
            <span>Định lượng cho 1 phần {editingRecipe ? `(${editingRecipe.unit})` : ""}</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.quantity}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, quantity: event.target.value }))
              }
              placeholder="VD: 20"
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

export default RecipesPage;
