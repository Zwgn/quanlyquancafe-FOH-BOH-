const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_MenuCategories_GetAll');
  return result.recordset;
};

const create = async (name) => {
  const pool = await getPool();
  await pool.request()
    .input('Name', sql.NVarChar(100), name)
    .execute('sp_MenuCategories_Create');
  return { message: 'Menu category created successfully' };
};

const update = async (id, name) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar(100), name)
    .execute('sp_MenuCategories_Update');
  return { message: 'Menu category updated successfully' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_MenuCategories_Delete');
  return { message: 'Menu category deleted successfully' };
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
