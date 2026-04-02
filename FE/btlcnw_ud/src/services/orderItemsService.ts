import {
  deleteOrderItem,
  OrderItemStatusPayload,
  OrderItemUpdatePayload,
  updateOrderItem,
  updateOrderItemStatus
} from "../api/orderItemsApi";

export const updateExistingOrderItem = async (
  id: string,
  payload: OrderItemUpdatePayload
) => updateOrderItem(id, payload);

export const deleteExistingOrderItem = async (id: string) => deleteOrderItem(id);

export const updateExistingOrderItemStatus = async (
  id: string,
  payload: OrderItemStatusPayload
) => updateOrderItemStatus(id, payload);
