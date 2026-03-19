const { getPool, sql } = require('../config/db');

const add = async (orderId, menuItemId, quantity) => {
  const pool = await getPool();
  await pool.request()
    .input('OrderId', sql.UniqueIdentifier, orderId)
    .input('MenuItemId', sql.UniqueIdentifier, menuItemId)
    .input('Quantity', sql.Int, quantity)
    .execute('sp_OrderItems_Add');
  return { message: 'Item added to order successfully' };
};

const update = async (id, quantity) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Quantity', sql.Int, quantity)
    .execute('sp_OrderItems_Update');
  return { message: 'Order item updated successfully' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_OrderItems_Delete');
  return { message: 'Order item deleted successfully' };
};

const updateStatus = async (id, status) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Status', sql.NVarChar(50), status)
    .execute('sp_OrderItems_UpdateStatus');
  return { message: 'Order item status updated successfully' };
};

module.exports = {
  add,
  update,
  remove,
  updateStatus
};
