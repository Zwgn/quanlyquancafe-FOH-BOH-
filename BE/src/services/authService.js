const { getPool, sql } = require('../config/db');

const login = async (username, password) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Username', sql.NVarChar(50), username)
    .input('Password', sql.NVarChar(100), password)
    .execute('sp_Login');

  return result.recordset[0] || null;
};

const getDisplayNameByUserId = async (userId) => {
  if (!userId) {
    return null;
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT TOP 1 Name
        FROM Employees
        WHERE UserId = @UserId
      `);

    return result.recordset?.[0]?.Name || null;
  } catch (err) {
    console.error('Không thể lấy tên hiển thị theo UserId:', err);
    return null;
  }
};

module.exports = {
  login,
  getDisplayNameByUserId
};
