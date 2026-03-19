const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Tables_GetAll');
  return result.recordset;
};

const create = async (name, capacity) => {
  const pool = await getPool();
  await pool.request()
    .input('Name', sql.NVarChar(50), name)
    .input('Capacity', sql.Int, capacity)
    .execute('sp_Tables_Create');
  return { message: 'Table created successfully' };
};

const update = async (id, name, capacity) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar(50), name)
    .input('Capacity', sql.Int, capacity)
    .execute('sp_Tables_Update');
  return { message: 'Table updated successfully' };
};

const updateStatus = async (id, status) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Status', sql.NVarChar(20), status)
    .execute('sp_Tables_UpdateStatus');
  return { message: 'Table status updated successfully' };
};

module.exports = {
  getAll,
  create,
  update,
  updateStatus
};
