const { getPool, sql } = require('../config/db');

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_Payments_GetAll');
  return result.recordset;
};

const checkout = async (orderId, paymentMethod) => {
  const pool = await getPool();
  await pool.request()
    .input('OrderId', sql.UniqueIdentifier, orderId)
    .input('PaymentMethod', sql.NVarChar(50), paymentMethod)
    .execute('sp_Payments_Checkout');
  return { message: 'Payment completed successfully' };
};

module.exports = {
  getAll,
  checkout
};
