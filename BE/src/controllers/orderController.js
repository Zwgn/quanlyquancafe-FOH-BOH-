const orderService = require('../services/orderService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const orders = await orderService.getAll();
    return success(res, orders);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    return error(res, 'Không thể lấy danh sách đơn hàng.', 500);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getById(id);

    if (!order) {
      return error(res, 'Đơn hàng không tồn tại.', 404);
    }

    return success(res, order);
  } catch (err) {
    console.error('Lỗi khi lấy thông tin đơn hàng:', err);
    return error(res, 'Không thể lấy thông tin đơn hàng.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { tableId, employeeId } = req.body;

    if (!tableId || !employeeId) {
      return error(res, 'ID bàn và ID nhân viên là bắt buộc.', 400);
    }

    const result = await orderService.create(tableId, employeeId);
    return success(res, result, 'Đơn hàng được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo đơn hàng:', err);
    return error(res, 'Tạo đơn hàng thất bại.', 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return error(res, 'Trạng thái là bắt buộc.', 400);
    }

    const result = await orderService.updateStatus(id, status);
    return success(res, result, 'Trạng thái đơn hàng được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
    return error(res, 'Cập nhật trạng thái đơn hàng thất bại.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderService.remove(id);
    return success(res, result, 'Đơn hàng được xóa thành công.');
  } catch (err) {
    console.error('Lỗi khi xóa đơn hàng:', err);
    return error(res, 'Xóa đơn hàng thất bại.', 500);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
  remove
};
