const userService = require('../services/userService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const users = await userService.getAll();
    return success(res, users);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng:', err);
    return error(res, 'Không thể lấy danh sách người dùng.', 500);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getById(id);

    if (!user) {
      return error(res, 'Người dùng không tồn tại.', 404);
    }

    return success(res, user);
  } catch (err) {
    console.error('Lỗi khi lấy thông tin người dùng:', err);
    return error(res, 'Không thể lấy thông tin người dùng.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { username, password, roleId } = req.body;

    if (!username || !password || !roleId) {
      return error(res, 'Tên người dùng, mật khẩu và roleId là bắt buộc.', 400);
    }

    const result = await userService.create(username, password, roleId);
    return success(res, result, 'Người dùng được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo người dùng:', err);
    return error(res, 'Không thể tạo người dùng.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, roleId } = req.body;

    if (!username || !password || !roleId) {
      return error(res, 'Tên người dùng, mật khẩu và roleId là bắt buộc.', 400);
    }

    const result = await userService.update(id, username, password, roleId);
    return success(res, result, 'Người dùng được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật người dùng:', err);
    return error(res, 'Không thể cập nhật người dùng.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.remove(id);
    return success(res, result, 'Người dùng được xóa thành công.');
  } catch (err) {
    console.error('Lỗi khi xóa người dùng:', err);
    return error(res, 'Không thể xóa người dùng.', 500);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
