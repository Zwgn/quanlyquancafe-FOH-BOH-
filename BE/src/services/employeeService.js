const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Employees_GetAll');
  return result.recordset;
};

const create = async (userId, name, phone, gender, birthDate, role, salary, address) => {
  const pool = await getPool();
  await pool.request()
    .input('UserId', sql.UniqueIdentifier, userId)
    .input('Name', sql.NVarChar(100), name)
    .input('Phone', sql.NVarChar(20), phone)
    .input('Gender', sql.NVarChar(10), gender || null)
    .input('BirthDate', sql.Date, birthDate || null)
    .input('Role', sql.NVarChar(50), role || null)
    .input('Salary', sql.Decimal(12, 2), salary || null)
    .input('Address', sql.NVarChar(255), address || null)
    .execute('sp_Employees_Create');
  return { message: 'Tạo nhân viên thành công' };
};

const update = async (id, name, phone, gender, birthDate, role, salary, address) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar(100), name)
    .input('Phone', sql.NVarChar(20), phone)
    .input('Gender', sql.NVarChar(10), gender || null)
    .input('BirthDate', sql.Date, birthDate || null)
    .input('Role', sql.NVarChar(50), role || null)
    .input('Salary', sql.Decimal(12, 2), salary || null)
    .input('Address', sql.NVarChar(255), address || null)
    .execute('sp_Employees_Update');
  return { message: 'Cập nhật nhân viên thành công' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Employees_Delete');
  return { message: 'Xóa nhân viên thành công' };
};

module.exports = {
  getAll,
  create,
  update,
  remove
};
