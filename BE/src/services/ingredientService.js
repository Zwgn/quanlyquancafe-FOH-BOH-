const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Ingredients_GetAll');
  return result.recordset;
};

const create = async (name, unit, stockQuantity, supplierId) => {
  const pool = await getPool();
  await pool.request()
    .input('Name', sql.NVarChar(100), name)
    .input('Unit', sql.NVarChar(20), unit)
    .input('StockQuantity', sql.Decimal(10, 2), stockQuantity)
    .input('SupplierId', sql.UniqueIdentifier, supplierId)
    .execute('sp_Ingredients_Create');
  return { message: 'Ingredient created successfully' };
};

const update = async (id, name, unit, stockQuantity, supplierId) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar(100), name)
    .input('Unit', sql.NVarChar(20), unit)
    .input('StockQuantity', sql.Decimal(10, 2), stockQuantity)
    .input('SupplierId', sql.UniqueIdentifier, supplierId)
    .execute('sp_Ingredients_Update');
  return { message: 'Ingredient updated successfully' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Ingredients_Delete');
  return { message: 'Ingredient deleted successfully' };
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
