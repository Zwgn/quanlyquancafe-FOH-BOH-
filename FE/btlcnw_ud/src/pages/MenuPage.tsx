import { FormEvent, useState } from "react";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import { usePageTitle } from "../hooks/usePageTitle";
import { useMenuManagement } from "../hooks/useMenuManagement";
import { useConfirm } from "../components/ui/ConfirmDialog";
import { formatCurrency } from "../utils/formatCurrency";
import {
  createMenuCategory,
  deleteMenuCategory,
  updateMenuCategory
} from "../api/menuCategoryApi";
import "../assets/styles/menu.css";
import { resolveImageUrl } from "../utils/imageUrl";

const MenuPage = () => {
  usePageTitle("Thực đơn | Coffee Management System");
  const confirm = useConfirm();
  const {
    items,
    categories,
    keyword,
    setKeyword,
    categoryFilter,
    setCategoryFilter,
    openModal,
    setOpenModal,
    editingItem,
    error,
    loading,
    form,
    setForm,
    imageFile,
    setImageFile,
    uploading,
    openCreateModal,
    openEditModal,
    handleSaveItem,
    handleDeleteItem,
    reloadMenuData
  } = useMenuManagement();

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSaveItem();
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryName("");
    setCategoryError(null);
  };

  const handleSaveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryName.trim()) {
      setCategoryError("Vui lòng nhập tên danh mục.");
      return;
    }
    try {
      setCategoryError(null);
      if (editingCategoryId) {
        await updateMenuCategory(editingCategoryId, { name: categoryName.trim() });
      } else {
        await createMenuCategory({ name: categoryName.trim() });
      }
      resetCategoryForm();
      await reloadMenuData();
    } catch {
      setCategoryError("Lưu danh mục thất bại.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const ok = await confirm({
      title: "Xóa danh mục",
      message: "Xóa danh mục này? Những món thuộc danh mục sẽ bị mất liên kết.",
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      setCategoryError(null);
      await deleteMenuCategory(id);
      if (editingCategoryId === id) resetCategoryForm();
      await reloadMenuData();
    } catch {
      setCategoryError("Xóa danh mục thất bại.");
    }
  };

  return (
    <div className="module-page menu-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Quản lý thực đơn</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Thực đơn</p>
        </div>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="module-card menu-card-shell">
        <div className="module-toolbar menu-toolbar-like-image">
          <input
            className="module-search"
            placeholder="Tìm kiếm theo tên món hoặc danh mục..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />

          <select
            className="menu-category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <AppButton variant="secondary" onClick={() => { resetCategoryForm(); setOpenCategoryModal(true); }}>
            Quản lý danh mục
          </AppButton>
          <AppButton onClick={openCreateModal}>+ Thêm món mới</AppButton>
        </div>

        {loading ? <p className="menu-loading">Đang tải dữ liệu...</p> : null}

        {!loading && items.length === 0 ? (
          <div className="menu-empty-state">
            <p className="menu-empty-icon">☕</p>
            <p className="menu-empty-title">Không có món phù hợp</p>
          </div>
        ) : null}

        <div className="menu-grid">
          {items.map((item) => (
            <article key={item.id} className="menu-item-card">
              <div className="menu-item-image-wrap">
                {item.imgUrl ? (
                  <img className="menu-item-image" src={resolveImageUrl(item.imgUrl)} alt={item.name} />
                ) : (
                  <div className="menu-item-image menu-item-image-placeholder">Không có ảnh</div>
                )}
                <span className="menu-item-category-badge">{item.categoryName}</span>
              </div>

              <div className="menu-item-body">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-price">{formatCurrency(item.price)}</p>
              </div>

              <div className="menu-item-actions">
                <AppButton variant="secondary" onClick={() => openEditModal(item)}>
                  Sửa
                </AppButton>
                <AppButton variant="danger" onClick={() => void handleDeleteItem(item.id)}>
                  Xóa
                </AppButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AppModal
        open={openModal}
        title={editingItem ? "Cập nhật món" : "Thêm món mới"}
        onClose={() => setOpenModal(false)}
      >
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Tên món</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              placeholder="VD: Cà phê sữa đá"
              required
            />
          </label>

          <label className="form-field">
            <span>Giá bán (VNĐ)</span>
            <input
              type="number"
              min={1000}
              value={form.price}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, price: event.target.value }))
              }
              placeholder="VD: 35000"
              required
            />
          </label>

          <label className="form-field form-field-span">
            <span>Danh mục</span>
            <select
              value={form.categoryId}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, categoryId: event.target.value }))
              }
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-field form-field-span">
            <label className="form-field">
              <span>Chọn ảnh từ máy</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setImageFile(file);
                  setForm((p) => ({ ...p, imgUrl: "" }));
                }}
              />
            </label>
            {(imageFile ?? null) !== null ? (
              <div className="menu-modal-preview">
                <img
                  src={URL.createObjectURL(imageFile!)}
                  alt="Xem trước"
                  className="menu-modal-preview-img"
                />
              </div>
            ) : form.imgUrl.trim() ? (
              <div className="menu-modal-preview">
                <img
                  src={resolveImageUrl(form.imgUrl)}
                  alt="Xem trước"
                  className="menu-modal-preview-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  onLoad={(e) => { (e.target as HTMLImageElement).style.display = "block"; }}
                />
              </div>
            ) : null}
          </div>

          <div className="module-row-actions form-field-span">
            <AppButton type="submit" disabled={uploading}>
              {uploading ? "Đang upload..." : "Lưu"}
            </AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setOpenModal(false)}>
              Hủy
            </AppButton>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={openCategoryModal}
        title="Quản lý danh mục"
        onClose={() => { setOpenCategoryModal(false); resetCategoryForm(); }}
      >
        {categoryError ? <p className="alert-error">{categoryError}</p> : null}

        <form className="form-grid" onSubmit={handleSaveCategory}>
          <label className="form-field form-field-span">
            <span>{editingCategoryId ? "Sửa danh mục" : "Thêm danh mục mới"}</span>
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="VD: Cà phê, Trà, Nước ép..."
              required
            />
          </label>
          <div className="module-row-actions form-field-span">
            <AppButton type="submit">{editingCategoryId ? "Cập nhật" : "Thêm"}</AppButton>
            {editingCategoryId ? (
              <AppButton type="button" variant="ghost" onClick={resetCategoryForm}>
                Hủy sửa
              </AppButton>
            ) : null}
          </div>
        </form>

        <div style={{ marginTop: 16 }}>
          <h4 className="panel-title" style={{ marginBottom: 8 }}>Danh sách danh mục</h4>
          {categories.length === 0 ? (
            <p style={{ color: "#888" }}>Chưa có danh mục nào.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {categories.map((category) => (
                <li
                  key={category.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#f8f9fa",
                    borderRadius: 8
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{category.name}</span>
                  <div className="module-row-actions">
                    <AppButton
                      variant="secondary"
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setCategoryName(category.name);
                        setCategoryError(null);
                      }}
                    >
                      Sửa
                    </AppButton>
                    <AppButton variant="danger" onClick={() => void handleDeleteCategory(category.id)}>
                      Xóa
                    </AppButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AppModal>
    </div>
  );
};

export default MenuPage;
