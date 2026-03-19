const inventoryService = require('../services/inventoryService');
const { success, error } = require('../utils/response');

const getTransactions = async (req, res) => {
  try {
    const transactions = await inventoryService.getTransactions();
    return success(res, transactions);
  } catch (err) {
    console.error('Get inventory transactions error:', err);
    return error(res, 'Failed to get inventory transactions', 500);
  }
};

const importInventory = async (req, res) => {
  try {
    const { ingredientId, quantity } = req.body;

    if (!ingredientId || !quantity) {
      return error(res, 'IngredientId and quantity are required', 400);
    }

    const result = await inventoryService.importInventory(ingredientId, quantity);
    return success(res, result, 'Inventory imported successfully', 201);
  } catch (err) {
    console.error('Import inventory error:', err);
    return error(res, 'Failed to import inventory', 500);
  }
};

const exportInventory = async (req, res) => {
  try {
    const { ingredientId, quantity } = req.body;

    if (!ingredientId || !quantity) {
      return error(res, 'IngredientId and quantity are required', 400);
    }

    const result = await inventoryService.exportInventory(ingredientId, quantity);
    return success(res, result, 'Inventory exported successfully', 201);
  } catch (err) {
    console.error('Export inventory error:', err);
    return error(res, 'Failed to export inventory', 500);
  }
};

module.exports = {
  getTransactions,
  importInventory,
  exportInventory
};
