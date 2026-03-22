const employeeService = require('../services/employeeService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const employees = await employeeService.getAll();
    return success(res, employees);
  } catch (err) {
    console.error('Lấy danh sách nhân viên thất bại.', err);
    return error(res, 'Không thể lấy danh sách nhân viên', 500);
  }
};

const create = async (req, res) => {
  try {
    const { userId, name, phone } = req.body;

    if (!userId || !name || !phone) {
      return error(res, 'Vui lòng nhập đầy đủ ID người dùng, tên và số điện thoại.', 400);
    }

    const result = await employeeService.create(userId, name, phone);
    return success(res, result, 'Nhân viên được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo nhân viên', err);
    return error(res, 'Tạo nhân viên thất bại.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    if (!name || !phone) {
      return error(res, 'Vui lòng nhập đầy đủ tên và số điện thoại.', 400);
    }

    const result = await employeeService.update(id, name, phone);
    return success(res, result, 'Nhân viên được cập nhật thành công');
  } catch (err) {
    console.error('Lỗi khi cập nhật nhân viên:', err);
    return error(res, 'Cập nhật nhân viên thất bại.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await employeeService.remove(id);
    return success(res, result, 'Nhân viên được xóa thành công');
  } catch (err) {
    console.error('Lỗi khi xóa nhân viên:', err);
    return error(res, 'Xóa nhân viên thất bại.', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
