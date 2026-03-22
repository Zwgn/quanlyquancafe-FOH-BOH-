const ingredientService = require('../services/ingredientService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const ingredients = await ingredientService.getAll();
    return success(res, ingredients);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách nguyên liệu:', err);
    return error(res, 'Không thể lấy danh sách nguyên liệu.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, unit, stockQuantity, supplierId } = req.body;

    if (!name || !unit || stockQuantity === undefined || !supplierId) {
      return error(res, 'Vui lòng nhập đầy đủ tên, đơn vị, số lượng tồn kho và ID nhà cung cấp.', 400);
    }

    const result = await ingredientService.create(name, unit, stockQuantity, supplierId);
    return success(res, result, 'Nguyên liệu được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo nguyên liệu:', err);
    return error(res, 'Tạo nguyên liệu thất bại.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, stockQuantity, supplierId } = req.body;

    if (!name || !unit || stockQuantity === undefined || !supplierId) {
      return error(res, 'Vui lòng nhập đầy đủ tên, đơn vị, số lượng tồn kho và ID nhà cung cấp.', 400);
    }

    const result = await ingredientService.update(id, name, unit, stockQuantity, supplierId);
    return success(res, result, 'Nguyên liệu được cập nhật thành công');
  } catch (err) {
    console.error('Lỗi khi cập nhật nguyên liệu:', err);
    return error(res, 'Cập nhật nguyên liệu thất bại.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ingredientService.remove(id);
    return success(res, result, 'Nguyên liệu được xóa thành công');
  } catch (err) {
    console.error('Lỗi khi xóa nguyên liệu:', err);
    return error(res, 'Xóa nguyên liệu thất bại.', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
