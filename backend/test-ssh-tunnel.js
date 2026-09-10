const mysql = require('mysql2/promise');
require('dotenv').config();

async function testSSHTunnelConnection() {
  console.log('Testing MySQL connection via SSH tunnel...');
  console.log('Configuration:');
  console.log('- DB_HOST:', process.env.DB_HOST);
  console.log('- DB_PORT:', process.env.DB_PORT);
  console.log('- DB_USER:', process.env.DB_USER);
  console.log('- DB_NAME:', process.env.DB_NAME);
  console.log('');
  console.log('Note: Make sure SSH tunnel is running:');
  console.log('ssh -p 2222 -L 3307:localhost:3306 std6730202386@119.59.102.161');
  console.log('');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3307,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000,
    });

    console.log('✅ Database connection successful via SSH tunnel!');
    console.log('Connected to:', process.env.DB_NAME);

    // Test a simple query
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('Test query result:', result[0]);

    await connection.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('Possible causes:');
      console.log('1. SSH tunnel is not running');
      console.log('2. Wrong local port (should be 3307)');
      console.log('3. SSH tunnel not forwarding correctly');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('');
      console.log('Possible causes:');
      console.log('1. Wrong DB_USER or DB_PASSWORD');
      console.log('2. User does not have permission');
    }
  }
}

testSSHTunnelConnection();
