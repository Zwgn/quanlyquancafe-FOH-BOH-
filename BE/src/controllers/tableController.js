const tableService = require('../services/tableService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const tables = await tableService.getAll();
    return success(res, tables);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách bàn:', err);
    return error(res, 'Không thể lấy danh sách bàn.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return error(res, 'Tên và sức chứa là bắt buộc.', 400);
    }

    const result = await tableService.create(name, capacity);
    return success(res, result, 'Bàn được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo bàn:', err);
    return error(res, 'Không thể tạo bàn.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return error(res, 'Tên và sức chứa là bắt buộc.', 400);
    }

    const result = await tableService.update(id, name, capacity);
    return success(res, result, 'Bàn được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật bàn:', err);
    return error(res, 'Không thể cập nhật bàn.', 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return error(res, 'Trạng thái là bắt buộc.', 400);
    }

    const result = await tableService.updateStatus(id, status);
    return success(res, result, 'Bàn được cập nhật trạng thái thành công');
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái bàn:', err);
    return error(res, 'Không thể cập nhật trạng thái bàn.', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  updateStatus
};
