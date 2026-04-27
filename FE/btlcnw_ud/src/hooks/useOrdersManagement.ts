import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import {
  addItemToOrder,
  createNewOrder,
  deleteExistingOrder,
  getOrderDetailView,
  getOrdersList,
  updateExistingOrderStatus
} from "../services/ordersService";
import {
  checkoutOrderPayment,
  getPaymentsList
} from "../services/paymentsService";
import { getTablesList } from "../services/tablesService";
import { getMenuItemsList } from "../services/menuService";
import {
  OrderDetailItem,
  OrderDetailModalData,
  OrderFormState,
  OrderListItem,
  PaymentMethod
} from "../types/order";
import { TableOption } from "../types/table";
import { MenuOption } from "../types/menu";
import {
  isPaidOrder,
  mapOrder,
  mergePaymentIntoOrders
} from "../utils/orderMapper";
import { useConfirm } from "../components/ui/ConfirmDialog";

const createEmptyForm = (employeeId = ""): OrderFormState => ({
  tableId: "",
  employeeId
});

const getCurrentEmployeeId = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return "";
  }

  try {
    const parsedUser = JSON.parse(rawUser) as {
      employeeId?: string;
      EmployeeId?: string;
    };

    return String(parsedUser.employeeId ?? parsedUser.EmployeeId ?? "").trim();
  } catch {
    return "";
  }
};

const getCurrentEmployeeName = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return "";
  }

  try {
    const parsedUser = JSON.parse(rawUser) as {
      displayName?: string;
      name?: string;
      fullName?: string;
      username?: string;
    };

    return String(
      parsedUser.displayName ??
      parsedUser.name ??
      parsedUser.fullName ??
      parsedUser.username ??
      ""
    ).trim();
  } catch {
    return "";
  }
};

const getApiErrorMessage = (requestError: unknown, fallbackMessage: string) => {
  if (!(requestError instanceof AxiosError)) {
    return fallbackMessage;
  }

  const apiMessage = (requestError.response?.data as { message?: string } | undefined)
    ?.message;

  return apiMessage || fallbackMessage;
};

export const useOrdersManagement = () => {
  const confirm = useConfirm();
  const currentEmployeeId = getCurrentEmployeeId();
  const currentEmployeeName = getCurrentEmployeeName();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [tables, setTables] = useState<TableOption[]>([]);
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetailModalData | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderListItem | null>(null);
  const [existingItems, setExistingItems] = useState<OrderDetailItem[]>([]);
  const [cartItems, setCartItems] = useState<
    Array<{ menuItemId: string; name: string; price: number; quantity: number; imgUrl: string }>
  >([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("1");
  const [detailLoading, setDetailLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [form, setForm] = useState<OrderFormState>(createEmptyForm(currentEmployeeId));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapTableOption = (input: unknown, index: number): TableOption => {
    const row = (input ?? {}) as Record<string, unknown>;

    return {
      id: String(row.id ?? row.Id ?? row.tableId ?? row.TableId ?? index),
      name: String(row.name ?? row.Name ?? `Bàn ${index + 1}`),
      status: String(row.status ?? row.Status ?? "")
    };
  };

  const mapMenuOption = (input: unknown, index: number): MenuOption => {
    const row = (input ?? {}) as Record<string, unknown>;

    return {
      id: String(row.id ?? row.Id ?? row.menuItemId ?? row.MenuItemId ?? index),
      name: String(row.name ?? row.Name ?? `Món ${index + 1}`),
      price: Number(row.price ?? row.Price ?? 0),
      imgUrl: String(row.imgUrl ?? row.ImageUrl ?? row.imageUrl ?? "")
    };
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orderResponse, paymentResponse] = await Promise.all([
        getOrdersList(),
        getPaymentsList()
      ]);

      const mappedOrders = orderResponse.map(mapOrder);
      const mergedOrders = mergePaymentIntoOrders(mappedOrders, paymentResponse);
      setOrders(mergedOrders);
      return mergedOrders;
    } catch {
      setError("Không tải được danh sách đơn hàng.");
      return [] as OrderListItem[];
    } finally {
      setLoading(false);
    }
  };

  const loadOrderFormOptions = async () => {
    try {
      const [tableResponse, menuResponse] = await Promise.all([
        getTablesList(),
        getMenuItemsList()
      ]);

      setTables(tableResponse.map(mapTableOption));
      setMenuOptions(menuResponse.map(mapMenuOption));
    } catch {
      setError("Không tải được dữ liệu bàn hoặc sản phẩm.");
    }
  };

  useEffect(() => {
    void loadOrders();
    void loadOrderFormOptions();
  }, []);

  const availableTables = useMemo(
    () => tables.filter((t) => t.status.toLowerCase() === "available"),
    [tables]
  );

  const filteredOrders = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return orders.filter((order) => {
      const matchKeyword =
        keyword.length === 0 ||
        [order.id, order.tableId, order.tableName, order.employeeId, order.employeeName]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      const matchStatus =
        statusFilter === "all" || order.status.toLowerCase() === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [orders, searchKeyword, statusFilter]);

  const openCreateOrderModal = () => {
    setEditingOrder(null);
    setExistingItems([]);
    setCartItems([]);
    setSelectedMenuItemId("");
    setSelectedQuantity("1");
    setForm(createEmptyForm(currentEmployeeId));
    setOpenCreateModal(true);
  };

  const openEditOrderModal = async (order: OrderListItem) => {
    if (isPaidOrder(order.status)) {
      setError("Đơn hàng đã thanh toán không thể chỉnh sửa.");
      return;
    }
    setError(null);
    setEditingOrder(order);
    setForm({
      tableId: order.tableId,
      employeeId: order.employeeId
    });
    setCartItems([]);
    setSelectedMenuItemId("");
    setSelectedQuantity("1");
    setOpenCreateModal(true);

    try {
      const response = await getOrderDetailView(order.id);
      const data = (response ?? {}) as Record<string, unknown>;
      const rawItems = Array.isArray(data.items) ? data.items : [];

      setExistingItems(
        rawItems.map((item) => {
          const row = (item ?? {}) as Record<string, unknown>;
          return {
            name: String(row.Name ?? row.name ?? "-"),
            imageUrl: String(row.ImageUrl ?? row.imageUrl ?? row.imgUrl ?? ""),
            quantity: Number(row.Quantity ?? row.quantity ?? 0),
            price: Number(row.Price ?? row.price ?? 0),
            total: Number(row.Total ?? row.total ?? 0),
            status: String(row.Status ?? row.status ?? "")
          };
        })
      );
    } catch {
      setExistingItems([]);
      setError("Không tải được món hiện tại của đơn.");
    }
  };

  const addProductToCart = (productId: string) => {
    const product = menuOptions.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((previous) => {
      const idx = previous.findIndex((c) => c.menuItemId === product.id);
      if (idx === -1) {
        return [
          ...previous,
          { menuItemId: product.id, name: product.name, price: product.price, quantity: 1, imgUrl: product.imgUrl ?? "" }
        ];
      }
      const next = [...previous];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
      return next;
    });
  };

  const updateCartItemQuantity = (menuItemId: string, delta: number) => {
    setCartItems((previous) =>
      previous.map((c) =>
        c.menuItemId === menuItemId
          ? { ...c, quantity: Math.max(1, c.quantity + delta) }
          : c
      )
    );
  };

  const addSelectedItemToCart = () => {
    const quantity = Number(selectedQuantity);

    if (!selectedMenuItemId) {
      setError("Vui lòng chọn sản phẩm.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Số lượng phải lớn hơn 0.");
      return;
    }

    const selectedProduct = menuOptions.find((option) => option.id === selectedMenuItemId);

    if (!selectedProduct) {
      setError("Không tìm thấy sản phẩm đã chọn.");
      return;
    }

    setError(null);
    setCartItems((previous) => {
      const existedIndex = previous.findIndex((item) => item.menuItemId === selectedProduct.id);
      if (existedIndex === -1) {
        return [
          ...previous,
          {
            menuItemId: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity,
            imgUrl: selectedProduct.imgUrl ?? ""
          }
        ];
      }

      const next = [...previous];
      next[existedIndex] = {
        ...next[existedIndex],
        quantity: next[existedIndex].quantity + quantity
      };
      return next;
    });

    setSelectedMenuItemId("");
    setSelectedQuantity("1");
  };

  const removeItemFromCart = (menuItemId: string) => {
    setCartItems((previous) => previous.filter((item) => item.menuItemId !== menuItemId));
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      setError("Vui lòng thêm ít nhất một sản phẩm vào giỏ.");
      return;
    }

    try {
      setError(null);

      if (editingOrder) {
        await Promise.all(
          cartItems.map((item) =>
            addItemToOrder(editingOrder.id, {
              menuItemId: item.menuItemId,
              quantity: item.quantity
            })
          )
        );
        setOpenCreateModal(false);
        setEditingOrder(null);
        setExistingItems([]);
        setCartItems([]);
        setForm(createEmptyForm(currentEmployeeId));
        await loadOrders();
        return;
      }

      if (!form.tableId.trim()) {
        setError("Vui lòng chọn bàn.");
        return;
      }

      if (!currentEmployeeId) {
        setError("Không xác định được nhân viên đăng nhập.");
        return;
      }

      await createNewOrder({
        tableId: form.tableId.trim(),
        employeeId: currentEmployeeId
      });

      const refreshedOrders = await loadOrders();
      const createdOrder = [...refreshedOrders]
        .filter(
          (item) =>
            item.tableId === form.tableId.trim() &&
            item.employeeId === currentEmployeeId
        )
        .sort((left, right) => {
          const leftTime = new Date(left.createdAt).getTime();
          const rightTime = new Date(right.createdAt).getTime();
          return rightTime - leftTime;
        })[0];

      if (createdOrder) {
        await Promise.all(
          cartItems.map((item) =>
            addItemToOrder(createdOrder.id, {
              menuItemId: item.menuItemId,
              quantity: item.quantity
            })
          )
        );
      }

      setOpenCreateModal(false);
      setForm(createEmptyForm(currentEmployeeId));
      setCartItems([]);
      await loadOrders();
      await loadOrderFormOptions();
    } catch {
      setError(editingOrder ? "Cập nhật đơn hàng thất bại." : "Tạo đơn hàng thất bại.");
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setError(null);
      await updateExistingOrderStatus(orderId, { status });
      await loadOrders();

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((previous) =>
          previous
            ? {
                ...previous,
                status
              }
            : previous
        );
      }
    } catch {
      setError("Cập nhật trạng thái thất bại.");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const ok = await confirm({
      title: "Xóa đơn hàng",
      message: "Bạn có chắc chắn muốn xóa đơn hàng này? Hành động không thể hoàn tác.",
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      setError(null);
      await deleteExistingOrder(orderId);
      setOpenDetailModal(false);
      setSelectedOrder(null);
      await loadOrders();
      await loadOrderFormOptions();
    } catch {
      setError("Xóa đơn hàng thất bại.");
    }
  };

  const handleCheckoutOrder = async (
    orderId: string,
    paymentMethod: PaymentMethod = "Cash"
  ) => {
    try {
      setError(null);
      await checkoutOrderPayment(orderId, paymentMethod);
      await loadOrders();
      await loadOrderFormOptions();

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((previous) =>
          previous
            ? {
                ...previous,
                status: "Completed"
              }
            : previous
        );
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Thanh toán thất bại."));
    }
  };

  const openOrderDetail = (order: OrderListItem) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
    setDetailLoading(true);
    setSelectedOrderDetail(null);

    void (async () => {
      try {
        const response = await getOrderDetailView(order.id);
        const data = (response ?? {}) as Record<string, unknown>;
        const rawOrder = (data.order ?? {}) as Record<string, unknown>;
        const rawItems = Array.isArray(data.items) ? data.items : [];

        setSelectedOrderDetail({
          id: String(rawOrder.Id ?? rawOrder.id ?? order.id),
          tableName: String(rawOrder.TableName ?? rawOrder.tableName ?? "-"),
          employeeName: String(rawOrder.EmployeeName ?? rawOrder.employeeName ?? "-"),
          status: String(rawOrder.Status ?? rawOrder.status ?? order.status),
          createdAt: String(rawOrder.CreatedAt ?? rawOrder.createdAt ?? order.createdAt),
          items: rawItems.map((item) => {
            const row = (item ?? {}) as Record<string, unknown>;
            return {
              name: String(row.Name ?? row.name ?? "-"),
              imageUrl: String(row.ImageUrl ?? row.imageUrl ?? row.imgUrl ?? ""),
              quantity: Number(row.Quantity ?? row.quantity ?? 0),
              price: Number(row.Price ?? row.price ?? 0),
              total: Number(row.Total ?? row.total ?? 0),
              status: String(row.Status ?? row.status ?? "")
            };
          })
        });
      } catch {
        setError("Không tải được chi tiết đơn hàng.");
      } finally {
        setDetailLoading(false);
      }
    })();
  };

  const canCheckoutOrder = (order: OrderListItem) => !isPaidOrder(order.status);

  return {
    orders: filteredOrders,
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
    selectedMenuItemId,
    setSelectedMenuItemId,
    selectedQuantity,
    setSelectedQuantity,
    form,
    setForm,
    loading,
    error,
    loadOrders,
    openCreateOrderModal,
    openEditOrderModal,
    addSelectedItemToCart,
    addProductToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    handleCreateOrder,
    handleUpdateStatus,
    handleDeleteOrder,
    handleCheckoutOrder,
    openOrderDetail,
    canCheckoutOrder
  };
};
