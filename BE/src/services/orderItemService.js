const { getPool, sql } = require('../config/db');

const add = async (orderId, menuItemId, quantity) => {
  const pool = await getPool();
  await pool.request()
    .input('OrderId', sql.UniqueIdentifier, orderId)
    .input('MenuItemId', sql.UniqueIdentifier, menuItemId)
    .input('Quantity', sql.Int, quantity)
    .execute('sp_OrderItems_Add');
  return { message: 'Thêm danh mục đơn hàng thành công' };
};

const update = async (id, quantity) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Quantity', sql.Int, quantity)
    .execute('sp_OrderItems_Update');
  return { message: 'Cập nhật danh mục đơn hàng thành công' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_OrderItems_Delete');
  return { message: 'Xóa mục danh mục đơn hàng thành công' };
};

const updateStatus = async (id, status) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Status', sql.NVarChar(50), status)
    .execute('sp_OrderItems_UpdateStatus');
  return { message: 'Cập nhật trạng thái danh mục đơn hàng thành công' };
};

module.exports = {
  add,
  update,
  remove,
  updateStatus
};
