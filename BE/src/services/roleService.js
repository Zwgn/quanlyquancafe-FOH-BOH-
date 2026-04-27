const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Roles_GetAll');
  return result.recordset;
};

const create = async (name) => {
  const pool = await getPool();
  await pool.request()
    .input('Name', sql.NVarChar(50), name)
    .execute('sp_Roles_Create');
  return { message: 'Tạo vai trò thành công' };
};

module.exports = {
  getAll,
  create
};
