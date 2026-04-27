const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Suppliers_GetAll');
  return result.recordset;
};

const create = async (name, phone, address) => {
  const pool = await getPool();
  await pool.request()
    .input('Name', sql.NVarChar(100), name)
    .input('Phone', sql.NVarChar(20), phone)
    .input('Address', sql.NVarChar(255), address)
    .execute('sp_Suppliers_Create');
  return { message: 'Thêm nhà cung cấp thành công' };
};

const update = async (id, name, phone, address) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar(100), name)
    .input('Phone', sql.NVarChar(20), phone)
    .input('Address', sql.NVarChar(255), address)
    .execute('sp_Suppliers_Update');
  return { message: 'Cập nhật nhà cung cấp thành công' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Suppliers_Delete');
  return { message: 'Xóa nhà cung cấp thành công' };
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
