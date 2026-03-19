const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Employees_GetAll');
  return result.recordset;
};

const create = async (userId, name, phone) => {
  const pool = await getPool();
  await pool.request()
    .input('UserId', sql.UniqueIdentifier, userId)
    .input('Name', sql.NVarChar(100), name)
    .input('Phone', sql.NVarChar(20), phone)
    .execute('sp_Employees_Create');
  return { message: 'Employee created successfully' };
};

const update = async (id, name, phone) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar(100), name)
    .input('Phone', sql.NVarChar(20), phone)
    .execute('sp_Employees_Update');
  return { message: 'Employee updated successfully' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Employees_Delete');
  return { message: 'Employee deleted successfully' };
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
