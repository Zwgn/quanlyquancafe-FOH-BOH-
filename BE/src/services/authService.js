const { getPool, sql } = require('../config/db');

const login = async (username, password) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Username', sql.NVarChar(50), username)
    .input('Password', sql.NVarChar(100), password)
    .execute('sp_Login');

  return result.recordset[0] || null;
};

const getEmployeeByUserId = async (userId) => {
  if (!userId) {
    return null;
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .execute('sp_Employees_GetByUserId');

    return result.recordset?.[0] || null;
  } catch (err) {
    console.error('Không thể lấy employee theo UserId:', err);
    return null;
  }
};

module.exports = {
  login,
  getEmployeeByUserId
};
