const menuItemService = require('../services/menuItemService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const menuItems = await menuItemService.getAll();
    return success(res, menuItems);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách món ăn:', err);
    return error(res, 'Không thể lấy danh sách món ăn.', 500);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await menuItemService.getById(id);

    if (!menuItem) {
      return error(res, 'Món ăn không tồn tại.', 404);
    }

    return success(res, menuItem);
  } catch (err) {
    console.error('Lỗi khi lấy thông tin món ăn:', err);
    return error(res, 'Không thể lấy thông tin món ăn.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, categoryId, price } = req.body;

    if (!name || !categoryId || !price) {
      return error(res, 'Tên, ID danh mục và giá là bắt buộc.', 400);
    }

    const result = await menuItemService.create(name, categoryId, price);
    return success(res, result, 'Món ăn được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo món ăn:', err);
    return error(res, 'Tạo món ăn thất bại.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || !price) {
      return error(res, 'Tên và giá là bắt buộc.', 400);
    }

    const result = await menuItemService.update(id, name, price);
    return success(res, result, 'Món ăn được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật món ăn:', err);
    return error(res, 'Cập nhật món ăn thất bại.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await menuItemService.remove(id);
    return success(res, result, 'Món ăn được xóa thành công.');
  } catch (err) {
    console.error('Lỗi khi xóa món ăn:', err);
    return error(res, 'Xóa món ăn thất bại.', 500);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
