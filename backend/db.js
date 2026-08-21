// db.js
import 'dotenv/config';
import sql from 'mssql';

const config = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(async (pool) => {
    console.log('✅ SQL Server database se connect ho gaya (' + process.env.DB_DATABASE + ')');
    try {
      await pool.request().query(`
        IF NOT EXISTS (
            SELECT * FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'gallery_images' AND COLUMN_NAME = 'category'
        )
        BEGIN
            ALTER TABLE gallery_images ADD category NVARCHAR(50) NULL;
        END;
      `);
    } catch (migErr) {
      console.error('Migration execution error:', migErr.message);
    }
    return pool;
  })
  .catch((err) => {
    console.error('❌ SQL Server connection FAIL ho gaya:', err.message);
    console.error('Error code:', err.code);
    console.error('Full error:', err.originalError || err);
  });

export default poolPromise;
export { sql };