const orderItemService = require('../services/orderItemService');
const { success, error } = require('../utils/response');

const add = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || !quantity) {
      return error(res, 'MenuItemId and quantity are required', 400);
    }

    const result = await orderItemService.add(orderId, menuItemId, quantity);
    return success(res, result, 'Item added to order successfully', 201);
  } catch (err) {
    console.error('Add order item error:', err);

    // Check for insufficient ingredients error
    if (err.message && err.message.includes('Not enough ingredients')) {
      return error(res, 'Not enough ingredients in stock', 400);
    }

    return error(res, 'Failed to add item to order', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return error(res, 'Quantity is required', 400);
    }

    const result = await orderItemService.update(id, quantity);
    return success(res, result, 'Order item updated successfully');
  } catch (err) {
    console.error('Update order item error:', err);
    return error(res, 'Failed to update order item', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderItemService.remove(id);
    return success(res, result, 'Order item deleted successfully');
  } catch (err) {
    console.error('Delete order item error:', err);
    return error(res, 'Failed to delete order item', 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return error(res, 'Status is required', 400);
    }

    const result = await orderItemService.updateStatus(id, status);
    return success(res, result, 'Order item status updated successfully');
  } catch (err) {
    console.error('Update order item status error:', err);
    return error(res, 'Failed to update order item status', 500);
  }
};

module.exports = {
  add,
  update,
  remove,
  updateStatus
};
