const menuItemIngredientService = require('../services/menuItemIngredientService');
const { success, error } = require('../utils/response');

const getByMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredients = await menuItemIngredientService.getByMenuItem(id);
    return success(res, ingredients);
  } catch (err) {
    console.error('Lỗi khi lấy nguyên liệu món ăn:', err);
    return error(res, 'Không thể lấy nguyên liệu món ăn.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredientId, quantity } = req.body;

    if (!ingredientId || !quantity) {
      return error(res, 'ID nguyên liệu và số lượng là bắt buộc.', 400);
    }

    const result = await menuItemIngredientService.create(id, ingredientId, quantity);
    return success(res, result, 'Nguyên liệu món ăn được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo nguyên liệu món ăn:', err);
    return error(res, 'Tạo nguyên liệu món ăn thất bại.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return error(res, 'Số lượng là bắt buộc.', 400);
    }

    const result = await menuItemIngredientService.update(id, quantity);
    return success(res, result, 'Nguyên liệu món ăn được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật nguyên liệu món ăn:', err);
    return error(res, 'Cập nhật nguyên liệu món ăn thất bại.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await menuItemIngredientService.remove(id);
    return success(res, result, 'Nguyên liệu món ăn được xóa thành công.');
  } catch (err) {
    console.error('Lỗi khi xóa nguyên liệu món ăn:', err);
    return error(res, 'Xóa nguyên liệu món ăn thất bại.', 500);
  }
};

module.exports = {
  getByMenuItem,
  create,
  update,
  remove
};
