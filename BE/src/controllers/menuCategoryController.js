const menuCategoryService = require('../services/menuCategoryService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const categories = await menuCategoryService.getAll();
    return success(res, categories);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách danh mục thực đơn:', err);
    return error(res, 'Không thể lấy danh sách danh mục thực đơn.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return error(res, 'Tên danh mục là bắt buộc.', 400);
    }

    const result = await menuCategoryService.create(name);
    return success(res, result, 'Danh mục thực đơn được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo danh mục thực đơn:', err);
    return error(res, 'Tạo danh mục thực đơn thất bại.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return error(res, 'Tên danh mục là bắt buộc.', 400);
    }

    const result = await menuCategoryService.update(id, name);
    return success(res, result, 'Danh mục thực đơn được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật danh mục thực đơn:', err);
    return error(res, 'Cập nhật danh mục thực đơn thất bại.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await menuCategoryService.remove(id);
    return success(res, result, 'Danh mục thực đơn được xóa thành công.');
  } catch (err) {
    console.error('Lỗi khi xóa danh mục thực đơn:', err);
    return error(res, 'Xóa danh mục thực đơn thất bại.', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
