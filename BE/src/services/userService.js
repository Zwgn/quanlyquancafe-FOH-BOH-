const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Users_GetAll');
  return result.recordset;
};

const getById = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Users_GetById');
  return result.recordset[0] || null;
};

const create = async (username, password, roleId) => {
  const pool = await getPool();
  await pool.request()
    .input('Username', sql.NVarChar(50), username)
    .input('Password', sql.NVarChar(100), password)
    .input('RoleId', sql.UniqueIdentifier, roleId)
    .execute('sp_Users_Create');
  return { message: 'User created successfully' };
};

const update = async (id, username, password, roleId) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Username', sql.NVarChar(50), username)
    .input('Password', sql.NVarChar(100), password)
    .input('RoleId', sql.UniqueIdentifier, roleId)
    .execute('sp_Users_Update');
  return { message: 'User updated successfully' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Users_Delete');
  return { message: 'User deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
