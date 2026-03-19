const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'htql_quan_cafe',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true
  },
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

const getPool = async () => {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log(' Database connected successfully');
    } catch (err) {
      console.error(' Database connection failed:', err);
      throw err;
    }
  }
  return pool;
};

const closePool = async () => {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection closed');
  }
};

module.exports = {
  sql,
  getPool,
  closePool
};
