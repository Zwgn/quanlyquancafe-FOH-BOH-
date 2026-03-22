const inventoryService = require('../services/inventoryService');
const { success, error } = require('../utils/response');

const getTransactions = async (req, res) => {
  try {
    const transactions = await inventoryService.getTransactions();
    return success(res, transactions);
  } catch (err) {
    console.error('Lỗi khi lấy giao dịch tồn kho:', err);
    return error(res, 'Không thể lấy giao dịch tồn kho.', 500);
  }
};

const importInventory = async (req, res) => {
  try {
    const { ingredientId, quantity } = req.body;

    if (!ingredientId || !quantity) {
      return error(res, 'Vui lòng nhập ID nguyên liệu và số lượng.', 400);
    }

    const result = await inventoryService.importInventory(ingredientId, quantity);
    return success(res, result, 'Tồn kho được nhập thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi nhập tồn kho:', err);
    return error(res, 'Nhập tồn kho thất bại.', 500);
  }
};

const exportInventory = async (req, res) => {
  try {
    const { ingredientId, quantity } = req.body;

    if (!ingredientId || !quantity) {
      return error(res, 'Vui lòng nhập ID nguyên liệu và số lượng.', 400);
    }

    const result = await inventoryService.exportInventory(ingredientId, quantity);
    return success(res, result, 'Tồn kho được xuất thành công.', 201);
  } catch (err) {
    console.error('Lỗi khi xuất tồn kho:', err);
    return error(res, 'Xuất tồn kho thất bại.', 500);
  }
};

module.exports = {
  getTransactions,
  importInventory,
  exportInventory
};
