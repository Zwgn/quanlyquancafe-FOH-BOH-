const orderService = require('../services/orderService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const orders = await orderService.getAll();
    return success(res, orders);
  } catch (err) {
    console.error('Get orders error:', err);
    return error(res, 'Failed to get orders', 500);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getById(id);

    if (!order) {
      return error(res, 'Order not found', 404);
    }

    return success(res, order);
  } catch (err) {
    console.error('Get order error:', err);
    return error(res, 'Failed to get order', 500);
  }
};

const create = async (req, res) => {
  try {
    const { tableId, employeeId } = req.body;

    if (!tableId || !employeeId) {
      return error(res, 'TableId and employeeId are required', 400);
    }

    const result = await orderService.create(tableId, employeeId);
    return success(res, result, 'Order created successfully', 201);
  } catch (err) {
    console.error('Create order error:', err);
    return error(res, 'Failed to create order', 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return error(res, 'Status is required', 400);
    }

    const result = await orderService.updateStatus(id, status);
    return success(res, result, 'Order status updated successfully');
  } catch (err) {
    console.error('Update order status error:', err);
    return error(res, 'Failed to update order status', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderService.remove(id);
    return success(res, result, 'Order deleted successfully');
  } catch (err) {
    console.error('Delete order error:', err);
    return error(res, 'Failed to delete order', 500);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
  remove
};
