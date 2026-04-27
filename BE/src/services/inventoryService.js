const { getPool, sql } = require('../config/db');

const getTransactions = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_InventoryTransactions_GetAll');
  return result.recordset;
};

const importInventory = async (ingredientId, quantity) => {
  const pool = await getPool();
  await pool.request()
    .input('IngredientId', sql.UniqueIdentifier, ingredientId)
    .input('Quantity', sql.Decimal(10, 2), quantity)
    .execute('sp_Inventory_Import');
  return { message: 'Nhập kho thành công' };
};

const exportInventory = async (ingredientId, quantity) => {
  const pool = await getPool();
  await pool.request()
    .input('IngredientId', sql.UniqueIdentifier, ingredientId)
    .input('Quantity', sql.Decimal(10, 2), quantity)
    .execute('sp_Inventory_Export');
  return { message: 'Xuất kho thành công' };
};

module.exports = {
  getTransactions,
  importInventory,
  exportInventory
};
