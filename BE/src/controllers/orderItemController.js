const orderItemService = require('../services/orderItemService');
const { success, error } = require('../utils/response');

const add = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || !quantity) {
      return error(res, 'ID món ăn và số lượng là bắt buộc.', 400);
    }

    const result = await orderItemService.add(orderId, menuItemId, quantity);
    return success(res, result, 'Món ăn được thêm vào đơn hàng thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi thêm món ăn vào đơn hàng:', err);

    // Check for insufficient ingredients error
    if (err.message && err.message.includes('Not enough ingredients')) {
      return error(res, 'Không đủ nguyên liệu trong kho', 400);
    }

    return error(res, 'Thêm món ăn vào đơn hàng thất bại.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return error(res, 'Số lượng là bắt buộc.', 400);
    }

    const result = await orderItemService.update(id, quantity);
    return success(res, result, 'Món ăn trong đơn hàng được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật món ăn trong đơn hàng:', err);
    return error(res, 'Cập nhật món ăn trong đơn hàng thất bại.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderItemService.remove(id);
    return success(res, result, 'Món ăn trong đơn hàng được xóa thành công.');
  } catch (err) {
    console.error('Lỗi khi xóa món ăn trong đơn hàng:', err);
    return error(res, 'Xóa món ăn trong đơn hàng thất bại.', 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return error(res, 'Trạng thái là bắt buộc.', 400);
    }

    const result = await orderItemService.updateStatus(id, status);
    return success(res, result, 'Trạng thái món ăn trong đơn hàng được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái món ăn trong đơn hàng:', err);
    return error(res, 'Cập nhật trạng thái món ăn trong đơn hàng thất bại.', 500);
  }
};

module.exports = {
  add,
  update,
  remove,
  updateStatus
};
