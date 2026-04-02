import { checkoutPayment, getPayments } from "../api/paymentsApi";

export const getPaymentsList = async () => getPayments();

export const checkoutOrderPayment = async (orderId: string, paymentMethod: string) =>
  checkoutPayment(orderId, paymentMethod);
