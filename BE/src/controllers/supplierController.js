const supplierService = require('../services/supplierService');
const { success, error } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const suppliers = await supplierService.getAll();
    return success(res, suppliers);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách nhà cung cấp:', err);
    return error(res, 'Không thể lấy danh sách nhà cung cấp.', 500);
  }
};

const create = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return error(res, 'Tên, số điện thoại và địa chỉ là bắt buộc.', 400);
    }

    const result = await supplierService.create(name, phone, address);
    return success(res, result, 'Nhà cung cấp được tạo thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi tạo nhà cung cấp:', err);
    return error(res, 'Không thể tạo nhà cung cấp.', 500);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return error(res, 'Tên, số điện thoại và địa chỉ là bắt buộc.', 400);
    }

    const result = await supplierService.update(id, name, phone, address);
    return success(res, result, 'Nhà cung cấp được cập nhật thành công.');
  } catch (err) {
    console.error('Lỗi khi cập nhật nhà cung cấp:', err);
    return error(res, 'Không thể cập nhật nhà cung cấp.', 500);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await supplierService.remove(id);
    return success(res, result, 'Nhà cung cấp được xóa thành công.');
  } catch (err) {
    console.error('Lỗi khi xóa nhà cung cấp :', err);
    return error(res, 'Không thể xóa nhà cung cấp.', 500);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
