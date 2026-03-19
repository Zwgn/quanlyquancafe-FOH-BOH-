const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Orders_GetAll');
  return result.recordset;
};

const getById = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Orders_GetById');
  return result.recordset[0] || null;
};

const create = async (tableId, employeeId) => {
  const pool = await getPool();
  await pool.request()
    .input('TableId', sql.UniqueIdentifier, tableId)
    .input('EmployeeId', sql.UniqueIdentifier, employeeId)
    .execute('sp_Orders_Create');
  return { message: 'Order created successfully' };
};

const updateStatus = async (id, status) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Status', sql.NVarChar(50), status)
    .execute('sp_Orders_UpdateStatus');
  return { message: 'Order status updated successfully' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Orders_Delete');
  return { message: 'Order deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
  remove
};
