const { getPool, sql } = require('../config/db');

const getDailyRevenue = async (date) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Date', sql.Date, date)
    .execute('sp_Report_DailyRevenue');
  return result.recordset[0] || null;
};

const getBestSellingItems = async (top) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Top', sql.Int, top)
    .execute('sp_Report_BestSellingItems');
  return result.recordset;
};

const getLowStockIngredients = async (threshold) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Threshold', sql.Decimal(10, 2), threshold)
    .execute('sp_Report_LowStockIngredients');
  return result.recordset;
};

module.exports = {
  getDailyRevenue,
  getBestSellingItems,
  getLowStockIngredients
};
