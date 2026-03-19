const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_MenuItems_GetAll');
  return result.recordset;
};

const getById = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_MenuItems_GetById');
  return result.recordset[0] || null;
};

const create = async (name, categoryId, price) => {
  const pool = await getPool();
  await pool.request()
    .input('Name', sql.NVarChar(100), name)
    .input('CategoryId', sql.UniqueIdentifier, categoryId)
    .input('Price', sql.Decimal(12, 2), price)
    .execute('sp_MenuItems_Create');
  return { message: 'Menu item created successfully' };
};

const update = async (id, name, price) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar(100), name)
    .input('Price', sql.Decimal(12, 2), price)
    .execute('sp_MenuItems_Update');
  return { message: 'Menu item updated successfully' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_MenuItems_Delete');
  return { message: 'Menu item deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
