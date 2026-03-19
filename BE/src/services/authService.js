const { getPool, sql } = require('../config/db');

const login = async (username, password) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Username', sql.NVarChar(50), username)
    .input('Password', sql.NVarChar(100), password)
    .execute('sp_Login');

  return result.recordset[0] || null;
};

module.exports = {
  login
};
