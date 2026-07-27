const mysql = require('mysql2/promise');

const { env } = require('./env');
const { logger } = require('../utils/logger');

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: env.DB_CONNECTION_LIMIT,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z',
  decimalNumbers: true,
});

async function testDatabaseConnection() {
  await pool.query('SELECT 1');
  logger.info(`Connected to MySQL database ${env.DB_NAME}`);
}

async function closePool() {
  await pool.end();
}

module.exports = { closePool, pool, testDatabaseConnection };
