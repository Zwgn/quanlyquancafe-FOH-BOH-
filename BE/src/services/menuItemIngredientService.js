const { getPool, sql } = require('../config/db');

const getByMenuItem = async (menuItemId) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('MenuItemId', sql.UniqueIdentifier, menuItemId)
    .execute('sp_MenuItemIngredients_GetByMenuItem');
  return result.recordset;
};

const create = async (menuItemId, ingredientId, quantity) => {
  const pool = await getPool();
  await pool.request()
    .input('MenuItemId', sql.UniqueIdentifier, menuItemId)
    .input('IngredientId', sql.UniqueIdentifier, ingredientId)
    .input('Quantity', sql.Decimal(10, 2), quantity)
    .execute('sp_MenuItemIngredients_Create');
  return { message: 'Recipe created successfully' };
};

const update = async (id, quantity) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Quantity', sql.Decimal(10, 2), quantity)
    .execute('sp_MenuItemIngredients_Update');
  return { message: 'Recipe updated successfully' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_MenuItemIngredients_Delete');
  return { message: 'Recipe deleted successfully' };
};

module.exports = {
  getByMenuItem,
  create,
  update,
  remove
};
