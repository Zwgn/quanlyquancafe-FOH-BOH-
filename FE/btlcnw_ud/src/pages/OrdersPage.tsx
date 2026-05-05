import React, { FormEvent, useState } from "react";
import { MdEdit, MdOutlineRemoveRedEye, MdPrint } from "react-icons/md";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import { useOrdersManagement } from "../hooks/useOrdersManagement";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatCurrency } from "../utils/formatCurrency";
import { getOrderStatusLabel, isPaidOrder } from "../utils/orderMapper";
import { escapeHtmlText, openPrintWindow } from "../utils/printDocument";
import "../assets/styles/orders.css";
import { resolveImageUrl } from "../utils/imageUrl";
import { uploadMenuImage } from "../api/menuApi";
import type { PaymentMethod } from "../types/order";

const QR_STORAGE_KEY = "cafe_qr_payment_url";

const OrdersPage = () => {
  usePageTitle("Đơn hàng | Coffee Management System");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>(localStorage.getItem(QR_STORAGE_KEY) || "");
  const [uploadingQr, setUploadingQr] = useState(false);

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
    availableTables,
    menuOptions,
    currentEmployeeId,
    currentEmployeeName,
    existingItems,
    cartItems,
    form,
    setForm,
    loading,
    error,
    openCreateOrderModal,
    openEditOrderModal,
    addProductToCart,
    updateCartItemQuantity,
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
            <option value="preparing">Đang chuẩn bị</option>
            <option value="ready">Sẵn sàng</option>
            <option value="served">Đã phục vụ</option>
            <option value="completed">Hoàn thành</option>
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
                    <td>{order.tableName || `Bàn ${order.tableId.slice(0, 6)}`}</td>
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
                        {!isPaidOrder(order.status) ? (
                          <button
                            type="button"
                            className="orders-edit-button"
                            onClick={() => void openEditOrderModal(order)}
                            aria-label="Sửa đơn hàng"
                          >
                            {React.createElement(MdEdit as any, { size: 20 })}
                          </button>
                        ) : null}
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
        wide
      >
        <form className="orders-create-form" onSubmit={handleCreateSubmit}>
          <div className="orders-create-top-row">
            <label className="form-field">
              <span>Chọn bàn <span className="orders-required">*</span></span>
              <select
                value={form.tableId}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, tableId: event.target.value }))
                }
                required
                disabled={Boolean(editingOrder)}
              >
                <option value="">-- Vui lòng chọn bàn --</option>
                {(editingOrder ? tables : availableTables).map((table) => (
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
          </div>

          {editingOrder ? (
            <p className="orders-form-note">
              Đang sửa đơn hiện có: chỉ thêm sản phẩm vào đơn, không thay đổi bàn và nhân viên.
            </p>
          ) : !currentEmployeeId ? (
            <p className="orders-form-note orders-form-note-warn">
              Không tìm thấy Employee ID của tài khoản đăng nhập. Vui lòng đăng nhập lại bằng tài khoản nhân viên.
            </p>
          ) : null}

          <div className="orders-product-section">
            <h4 className="orders-section-title">Chọn sản phẩm</h4>
            <div className="orders-product-grid">
              {menuOptions.map((item) => (
                <div
                  key={item.id}
                  className="orders-product-card"
                  onClick={() => addProductToCart(item.id)}
                >
                  {item.imgUrl ? (
                    <img className="orders-product-card-img" src={resolveImageUrl(item.imgUrl)} alt={item.name} />
                  ) : (
                    <div className="orders-product-card-img orders-product-card-placeholder">☕</div>
                  )}
                  <h5 className="orders-product-card-name">{item.name}</h5>
                  <p className="orders-product-card-price">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {editingOrder && existingItems.length > 0 ? (
            <div className="orders-cart-box">
              <h4 className="orders-section-title">Món hiện có trong đơn</h4>
              <table className="orders-cart-table">
                <thead>
                  <tr>
                    <th>Món</th>
                    <th style={{ textAlign: "center" }}>SL</th>
                    <th style={{ textAlign: "right" }}>Đơn giá</th>
                    <th style={{ textAlign: "right" }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {existingItems.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td>{item.name}</td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>{formatCurrency(item.price)}</td>
                      <td style={{ textAlign: "right" }}>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="orders-cart-box">
            <h4 className="orders-section-title">Giỏ hàng thêm mới</h4>
            {cartItems.length === 0 ? (
              <div className="orders-cart-empty">
                <span className="orders-cart-empty-icon">🛒</span>
                <p>Chưa có sản phẩm trong giỏ hàng</p>
              </div>
            ) : (
              <>
                <table className="orders-cart-table">
                  <thead>
                    <tr>
                      <th>Món</th>
                      <th style={{ textAlign: "center" }}>Số lượng</th>
                      <th style={{ textAlign: "right" }}>Đơn giá</th>
                      <th style={{ textAlign: "right" }}>Thành tiền</th>
                      <th style={{ textAlign: "center", width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.menuItemId}>
                        <td>{item.name}</td>
                        <td style={{ textAlign: "center" }}>
                          <div className="orders-qty-controls">
                            <button
                              type="button"
                              className="orders-qty-btn"
                              onClick={() => updateCartItemQuantity(item.menuItemId, -1)}
                            >
                              −
                            </button>
                            <span className="orders-qty-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="orders-qty-btn"
                              onClick={() => updateCartItemQuantity(item.menuItemId, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>{formatCurrency(item.price)}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="orders-link-button"
                            onClick={() => removeItemFromCart(item.menuItemId)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ textAlign: "right", fontWeight: 600 }}>TỔNG:</td>
                      <td className="orders-cart-total-value">
                        {formatCurrency(cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </>
            )}
          </div>

          <div className="orders-create-footer">
            <AppButton type="submit" disabled={cartItems.length === 0}>
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
        title={`Chi tiết đơn hàng #${selectedOrder?.id.slice(0, 8) ?? ""}`}
        onClose={() => setOpenDetailModal(false)}
      >
        {selectedOrder ? (
          <div className="orders-detail-panel">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
              <AppButton
                variant="secondary"
                onClick={() => {
                  if (!selectedOrder || !selectedOrderDetail) return;
                  const rows = selectedOrderDetail.items
                    .map(
                      (item) => `
                      <tr>
                        <td>${escapeHtmlText(item.name)}</td>
                        <td class="num">${item.quantity}</td>
                        <td class="num">${formatCurrency(item.price)}</td>
                        <td class="num">${formatCurrency(item.price * item.quantity)}</td>
                      </tr>`
                    )
                    .join("");
                  const html = `
                    <div class="doc-header">
                      <div class="doc-brand">DungCafe</div>
                      <div class="doc-brand-tagline">Hệ thống quản lý quán cà phê</div>
                      <div class="doc-title">Hóa đơn thanh toán</div>
                    </div>
                    <div class="doc-meta">
                      <div>
                        <p><strong>Mã đơn:</strong> #${escapeHtmlText(selectedOrder.id.slice(0, 8).toUpperCase())}</p>
                        <p><strong>Bàn:</strong> ${escapeHtmlText(selectedOrderDetail.tableName)}</p>
                        <p><strong>Nhân viên:</strong> ${escapeHtmlText(selectedOrderDetail.employeeName)}</p>
                      </div>
                      <div>
                        <p><strong>Trạng thái:</strong> ${escapeHtmlText(getOrderStatusLabel(selectedOrderDetail.status))}</p>
                        <p><strong>Thời gian tạo:</strong> ${escapeHtmlText(selectedOrderDetail.createdAt)}</p>
                        <p><strong>Ngày in:</strong> ${new Date().toLocaleString("vi-VN")}</p>
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Món</th>
                          <th class="num">SL</th>
                          <th class="num">Đơn giá</th>
                          <th class="num">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>${rows || `<tr><td colspan="4" style="text-align:center;color:#888;">Không có món</td></tr>`}</tbody>
                      <tfoot>
                        <tr>
                          <td colspan="3" class="num">TỔNG CỘNG</td>
                          <td class="num">${formatCurrency(selectedOrder.totalAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    <div class="doc-footer">
                      Cảm ơn quý khách! Hẹn gặp lại tại DungCafe.
                    </div>
                  `;
                  openPrintWindow(html, `HoaDon-${selectedOrder.id.slice(0, 8)}`);
                }}
                disabled={!selectedOrderDetail}
              >
                {React.createElement(MdPrint as any, { size: 18, style: { marginRight: 6, verticalAlign: "middle" } })}
                In hóa đơn
              </AppButton>
            </div>

            {detailLoading ? <p className="orders-empty">Đang tải chi tiết...</p> : null}

            {selectedOrderDetail ? (
              <>
                <div className="orders-detail-info">
                  <div className="orders-detail-info-grid">
                    <div className="orders-detail-info-item">
                      <span className="orders-detail-label">BÀN</span>
                      <span className="orders-detail-value">{selectedOrderDetail.tableName}</span>
                    </div>
                    <div className="orders-detail-info-item">
                      <span className="orders-detail-label">TRẠNG THÁI</span>
                      <span className={`orders-status-chip ${isPaidOrder(selectedOrderDetail.status) ? "orders-status-paid" : ""}`}>
                        {getOrderStatusLabel(selectedOrderDetail.status)}
                      </span>
                    </div>
                    <div className="orders-detail-info-item">
                      <span className="orders-detail-label">NHÂN VIÊN</span>
                      <span className="orders-detail-value">{selectedOrderDetail.employeeName}</span>
                    </div>
                    <div className="orders-detail-info-item">
                      <span className="orders-detail-label">THỜI GIAN TẠO</span>
                      <span className="orders-detail-value">{selectedOrderDetail.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="orders-detail-items-section">
                  <h4 className="orders-section-title">Sản phẩm đã đặt</h4>
                  {selectedOrderDetail.items.length === 0 ? (
                    <p className="orders-empty">Đơn hàng chưa có món.</p>
                  ) : (
                    <table className="orders-detail-items-table">
                      <thead>
                        <tr>
                          <th>Món</th>
                          <th style={{ textAlign: "center" }}>SL</th>
                          <th style={{ textAlign: "right" }}>Đơn giá</th>
                          <th style={{ textAlign: "right" }}>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrderDetail.items.map((item, index) => (
                          <tr key={`${item.name}-${index}`}>
                            <td>
                              <div className="orders-detail-item-cell">
                                {item.imageUrl ? (
                                  <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="orders-detail-item-thumb" />
                                ) : null}
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>{item.quantity}</td>
                            <td style={{ textAlign: "right" }}>{formatCurrency(item.price)}</td>
                            <td style={{ textAlign: "right" }}>{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} style={{ textAlign: "right", fontWeight: 600 }}>TỔNG CỘNG:</td>
                          <td className="orders-detail-total-value">
                            {formatCurrency(selectedOrder.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                </div>
              </>
            ) : null}

            <div className="orders-detail-actions">
              {isPaidOrder(selectedOrder.status) ? (
                <p className="orders-form-note">
                  Đơn hàng đã thanh toán. Không thể chỉnh sửa hoặc xóa.
                </p>
              ) : (
                <>
                  <select
                    value={selectedOrder.status}
                    onChange={(event) =>
                      void handleUpdateStatus(selectedOrder.id, event.target.value)
                    }
                  >
                    <option value="Open">Chờ xử lý</option>
                    <option value="Preparing">Đang chuẩn bị</option>
                    <option value="Ready">Sẵn sàng</option>
                    <option value="Served">Đã phục vụ</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>

                  {canCheckoutOrder(selectedOrder) ? (
                    <AppButton
                      onClick={() => {
                        setCheckoutOrderId(selectedOrder.id);
                        setPaymentMethod("Cash");
                        setShowPaymentModal(true);
                      }}
                    >
                      Thanh toán
                    </AppButton>
                  ) : null}

                  <AppButton
                    variant="danger"
                    onClick={() => void handleDeleteOrder(selectedOrder.id)}
                  >
                    Xóa đơn
                  </AppButton>
                </>
              )}
            </div>
          </div>
        ) : null}
      </AppModal>

      {/* ====== MODAL CHỌN PHƯƠNG THỨC THANH TOÁN ====== */}
      <AppModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Chọn phương thức thanh toán"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
          <label className="form-field">
            <span>Phương thức</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              style={{ fontSize: 15, padding: "10px 12px" }}
            >
              <option value="Cash">Tiền mặt</option>
              <option value="EWallet">Thanh toán online</option>
            </select>
          </label>

          {paymentMethod === "EWallet" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Quét mã QR để thanh toán</p>
              {qrUrl ? (
                <img
                  src={resolveImageUrl(qrUrl)}
                  alt="QR thanh toán"
                  style={{
                    width: 220, height: 220, objectFit: "contain",
                    border: "1px solid #e5e7eb", borderRadius: 8, padding: 8
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 220, height: 220, display: "flex", alignItems: "center",
                    justifyContent: "center", background: "#f3f4f6",
                    borderRadius: 8, color: "#6c757d", fontSize: 14
                  }}
                >
                  Chưa có mã QR
                </div>
              )}
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setUploadingQr(true);
                      const url = await uploadMenuImage(file);
                      setQrUrl(url);
                      localStorage.setItem(QR_STORAGE_KEY, url);
                    } catch { /* silent */ }
                    finally { setUploadingQr(false); }
                    e.target.value = "";
                  }}
                />
                <span
                  className="ui-button ui-button-ghost"
                  style={{ pointerEvents: "none" }}
                >
                  {uploadingQr ? "Đang tải..." : qrUrl ? "Đổi mã QR" : "Tải mã QR lên"}
                </span>
              </label>
            </div>
          ) : null}

          <div className="module-row-actions" style={{ justifyContent: "flex-end", gap: 8 }}>
            <AppButton
              variant="ghost"
              onClick={() => setShowPaymentModal(false)}
            >
              Hủy
            </AppButton>
            <AppButton
              onClick={async () => {
                await handleCheckoutOrder(checkoutOrderId, paymentMethod);
                setShowPaymentModal(false);
              }}
            >
              Xác nhận thanh toán
            </AppButton>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default OrdersPage;
