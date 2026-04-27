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

const getDetail = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Orders_GetDetail');

  const orderInfo = result.recordsets?.[0]?.[0] || null;
  const items = result.recordsets?.[1] || [];

  if (!orderInfo) {
    return null;
  }

  return {
    order: orderInfo,
    items
  };
};

const create = async (tableId, employeeId) => {
  const pool = await getPool();
  await pool.request()
    .input('TableId', sql.UniqueIdentifier, tableId)
    .input('EmployeeId', sql.UniqueIdentifier, employeeId)
    .execute('sp_Orders_Create');
  return { message: 'Tạo đơn hàng thành công' };
};

const updateStatus = async (id, status) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Status', sql.NVarChar(50), status)
    .execute('sp_Orders_UpdateStatus');
  return { message: 'Cập nhật trạng thái đơn hàng thành công' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_Orders_Delete');
  return { message: 'Xóa đơn hàng thành công' };
};

const isOrderPaid = async (id) => {
  const order = await getById(id);
  if (!order) return false;
  const status = String(order.Status ?? order.status ?? '').toLowerCase();
  return status === 'completed' || status === 'paid';
};

module.exports = {
  getAll,
  getById,
  getDetail,
  create,
  updateStatus,
  remove,
  isOrderPaid
};
