require('dotenv').config();
const { getPool, closePool } = require('./src/config/db');

(async () => {
  try {
    console.log('Testing database connection...');
    console.log('Server:', process.env.DB_SERVER);
    console.log('Database:', process.env.DB_DATABASE);
    console.log('User:', process.env.DB_USER);

    const pool = await getPool();
    console.log(' Database connection successful!');

    // Test a simple query
    const result = await pool.request().query('SELECT @@VERSION as version');
    console.log('\nSQL Server Version:');
    console.log(result.recordset[0].version);

    await closePool();
    process.exit(0);
  } catch (err) {
    console.error(' Database connection failed:');
    console.error(err.message);
    process.exit(1);
  }
})();
