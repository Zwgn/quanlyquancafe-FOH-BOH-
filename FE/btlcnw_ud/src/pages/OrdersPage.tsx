import React, { FormEvent } from "react";
import { MdEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import { useOrdersManagement } from "../hooks/useOrdersManagement";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatCurrency } from "../utils/formatCurrency";
import { getOrderStatusLabel, isPaidOrder } from "../utils/orderMapper";
import "../assets/styles/orders.css";

const OrdersPage = () => {
  usePageTitle("Đơn hàng | DungCafe Quản trị");

  const {
    orders,
    searchKeyword,
    setSearchKeyword,
    statusFilter,
    setStatusFilter,
    selectedOrder,
    selectedOrderDetail,
    detailLoading,
    openCreateModal,
    setOpenCreateModal,
    openDetailModal,
    setOpenDetailModal,
    editingOrder,
    tables,
    menuOptions,
    currentEmployeeId,
    currentEmployeeName,
    existingItems,
    cartItems,
    selectedMenuItemId,
    setSelectedMenuItemId,
    selectedQuantity,
    setSelectedQuantity,
    form,
    setForm,
    loading,
    error,
    openCreateOrderModal,
    openEditOrderModal,
    addSelectedItemToCart,
    removeItemFromCart,
    handleCreateOrder,
    handleUpdateStatus,
    handleDeleteOrder,
    handleCheckoutOrder,
    openOrderDetail,
    canCheckoutOrder
  } = useOrdersManagement();

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleCreateOrder();
  };

  return (
    <div className="module-page orders-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Đơn hàng</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Đơn hàng</p>
        </div>
        <AppButton onClick={openCreateOrderModal}>+ Tạo đơn mới</AppButton>
      </div>

      {error ? <p className="alert-error">{error}</p> : null}

      <section className="module-card">
        <div className="orders-toolbar">
          <input
            className="module-search orders-search"
            placeholder="Tìm kiếm theo mã đơn, bàn hoặc nhân viên..."
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
          <select
            className="orders-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="open">Chờ xử lý</option>
            <option value="pending">Chờ xử lý</option>
            <option value="preparing">Đang chuẩn bị</option>
            <option value="ready">Sẵn sàng</option>
            <option value="served">Đã phục vụ</option>
            <option value="completed">Đã thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Bàn</th>
                <th>Thời gian vào</th>
                <th>Thời gian ra</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td className="orders-empty" colSpan={7}>
                    {loading ? "Đang tải dữ liệu..." : "Không có đơn hàng phù hợp."}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="orders-id">#{order.id.slice(0, 8)}</td>
                    <td>Bàn {order.tableId.slice(0, 6)}</td>
                    <td>{order.createdAt}</td>
                    <td>{order.paidAt ?? "-"}</td>
                    <td className="orders-total">{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span
                        className={
                          isPaidOrder(order.status)
                            ? "orders-status-chip orders-status-paid"
                            : "orders-status-chip"
                        }
                      >
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      <div className="orders-row-actions">
                        <button
                          type="button"
                          className="orders-edit-button"
                          onClick={() => void openEditOrderModal(order)}
                          aria-label="Sửa đơn hàng"
                        >
                          {React.createElement(MdEdit as any, { size: 20 })}
                        </button>
                        <button
                          type="button"
                          className="orders-eye-button"
                          onClick={() => openOrderDetail(order)}
                          aria-label="Xem chi tiết đơn"
                        >
                          {React.createElement(MdOutlineRemoveRedEye as any, { size: 20 })}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AppModal
        open={openCreateModal}
        title={editingOrder ? "Sửa đơn hàng" : "Tạo đơn mới"}
        onClose={() => setOpenCreateModal(false)}
      >
        <form className="form-grid" onSubmit={handleCreateSubmit}>
          <label className="form-field">
            <span>Chọn bàn *</span>
            <select
              value={form.tableId}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, tableId: event.target.value }))
              }
              required
              disabled={Boolean(editingOrder)}
            >
              <option value="">-- Vui lòng chọn bàn --</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Nhân viên tạo đơn</span>
            <input
              value={currentEmployeeName || form.employeeId || "-"}
              readOnly
              disabled
            />
          </label>

          {editingOrder ? (
            <p className="orders-form-note form-field-span">
              Đang sửa đơn hiện có: chỉ thêm sản phẩm vào đơn, không thay đổi bàn và nhân viên.
            </p>
          ) : !currentEmployeeId ? (
            <p className="orders-form-note form-field-span">
              Không tìm thấy Employee ID của tài khoản đăng nhập. Vui lòng đăng nhập lại bằng tài khoản nhân viên.
            </p>
          ) : null}

          <div className="orders-product-picker form-field-span">
            <label className="form-field">
              <span>Chọn sản phẩm</span>
              <select
                value={selectedMenuItemId}
                onChange={(event) => setSelectedMenuItemId(event.target.value)}
              >
                <option value="">-- Chọn sản phẩm --</option>
                {menuOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {formatCurrency(item.price)}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field orders-qty-field">
              <span>Số lượng</span>
              <input
                type="number"
                min={1}
                value={selectedQuantity}
                onChange={(event) => setSelectedQuantity(event.target.value)}
              />
            </label>

            <AppButton type="button" variant="secondary" onClick={addSelectedItemToCart}>
              + Thêm vào giỏ
            </AppButton>
          </div>

          {editingOrder && existingItems.length > 0 ? (
            <div className="orders-cart-box form-field-span">
              <h4 className="orders-cart-title">Món hiện có trong đơn</h4>
              <div className="orders-cart-list">
                {existingItems.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="orders-cart-item">
                    <span>{item.name} x{item.quantity}</span>
                    <strong>{formatCurrency(item.total)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="orders-cart-box form-field-span">
            <h4 className="orders-cart-title">Giỏ hàng thêm mới</h4>
            {cartItems.length === 0 ? (
              <p className="orders-empty-inline">Chưa có sản phẩm trong giỏ hàng</p>
            ) : (
              <div className="orders-cart-list">
                {cartItems.map((item) => (
                  <div key={item.menuItemId} className="orders-cart-item">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <div className="orders-cart-item-actions">
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                      <button
                        type="button"
                        className="orders-link-button"
                        onClick={() => removeItemFromCart(item.menuItemId)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="module-row-actions form-field-span">
            <AppButton type="submit">
              {editingOrder ? "Lưu thay đổi" : "Tạo đơn hàng"}
            </AppButton>
            <AppButton type="button" variant="ghost" onClick={() => setOpenCreateModal(false)}>
              Hủy
            </AppButton>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={openDetailModal}
        title="Chi tiết đơn hàng"
        onClose={() => setOpenDetailModal(false)}
      >
        {selectedOrder ? (
          <div className="orders-detail-panel">
            {detailLoading ? <p className="orders-empty">Đang tải chi tiết...</p> : null}

            {selectedOrderDetail ? (
              <>
                <div className="orders-detail-grid">
                  <p>
                    <strong>Mã đơn:</strong> #{selectedOrderDetail.id}
                  </p>
                  <p>
                    <strong>Bàn:</strong> {selectedOrderDetail.tableName}
                  </p>
                  <p>
                    <strong>Nhân viên:</strong> {selectedOrderDetail.employeeName}
                  </p>
                  <p>
                    <strong>Tạo lúc:</strong> {selectedOrderDetail.createdAt}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                </div>

                <div className="orders-detail-items-list">
                  {selectedOrderDetail.items.length === 0 ? (
                    <p className="orders-empty">Đơn hàng chưa có món.</p>
                  ) : (
                    selectedOrderDetail.items.map((item, index) => (
                      <article className="orders-item-row" key={`${item.name}-${index}`}>
                        <div className="orders-item-image-wrap">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="orders-item-image" />
                          ) : (
                            <div className="orders-item-image orders-item-image-placeholder">Không ảnh</div>
                          )}
                        </div>
                        <div className="orders-item-content">
                          <p className="orders-item-name">{item.name}</p>
                          <p className="orders-item-meta">SL: {item.quantity} • {item.status}</p>
                        </div>
                        <div className="orders-item-price-wrap">
                          <p className="orders-item-price">{formatCurrency(item.price)}</p>
                          <p className="orders-item-total">{formatCurrency(item.total)}</p>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </>
            ) : null}

            <div className="orders-detail-actions">
              <select
                value={selectedOrder.status}
                onChange={(event) =>
                  void handleUpdateStatus(selectedOrder.id, event.target.value)
                }
              >
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Served">Served</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <AppButton
                variant="secondary"
                onClick={() => void handleCheckoutOrder(selectedOrder.id)}
                disabled={!canCheckoutOrder(selectedOrder)}
              >
                Thanh toán
              </AppButton>

              <AppButton
                variant="danger"
                onClick={() => void handleDeleteOrder(selectedOrder.id)}
              >
                Xóa đơn
              </AppButton>
            </div>
          </div>
        ) : null}
      </AppModal>
    </div>
  );
};

export default OrdersPage;
