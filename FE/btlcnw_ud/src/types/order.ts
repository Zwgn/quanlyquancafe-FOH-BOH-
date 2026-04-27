export interface OrderPayload {
  tableId: string;
  employeeId: string;
}

export interface OrderStatusPayload {
  status: string;
}

export interface OrderItemPayload {
  menuItemId: string;
  quantity: number;
}

export interface OrderSummary {
  id: string;
  tableId: string;
  tableName: string;
  employeeId: string;
  status: string;
  createdAt: string;
}

export interface OrderItemDetail {
  id: string;
  menuItemId: string;
  menuName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderDetailView {
  id: string;
  tableId: string;
  tableName: string;
  status: string;
  items: OrderItemDetail[];
  totalPrice: number;
}

export interface OrderListItem {
  id: string;
  tableId: string;
  tableName: string;
  employeeId: string;
  employeeName: string;
  status: string;
  createdAt: string;
  paidAt?: string;
  totalAmount: number;
}

export interface OrderFormState {
  tableId: string;
  employeeId: string;
}

export type PaymentMethod = "Cash" | "Card" | "EWallet";

export interface OrderDetailItem {
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
}

export interface OrderDetailModalData {
  id: string;
  tableName: string;
  employeeName: string;
  status: string;
  createdAt: string;
  items: OrderDetailItem[];
}
