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
