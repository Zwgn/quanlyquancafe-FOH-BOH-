const roleService = require('../services/roleService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const roles = await roleService.getAll();
    return success(res, roles);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách vai trò:', err);
    return error(res, 'Không thể lấy danh sách vai trò.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return error(res, 'Tên vai trò là bắt buộc.', 400);
    }

    const result = await roleService.create(name);
    return success(res, result, 'Vai trò được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo vai trò:', err);
    return error(res, 'Không thể tạo vai trò.', 500);
  }
};

module.exports = {
  getAll,
  create
};
