import {
  addOrderItem,
  createOrder,
  deleteOrder,
  getOrders,
  updateOrderStatus
} from "../api/ordersApi";
import { OrderItemPayload, OrderPayload, OrderStatusPayload } from "../types/order";

export const getOrdersList = async () => getOrders();

export const createNewOrder = async (payload: OrderPayload) =>
  createOrder(payload);

export const updateExistingOrderStatus = async (
  orderId: string,
  payload: OrderStatusPayload
) => updateOrderStatus(orderId, payload);

export const deleteExistingOrder = async (orderId: string) =>
  deleteOrder(orderId);

export const addItemToOrder = async (orderId: string, payload: OrderItemPayload) =>
  addOrderItem(orderId, payload);
