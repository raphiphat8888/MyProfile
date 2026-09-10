const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Configuration:');
  console.log('- DB_HOST:', process.env.DB_HOST);
  console.log('- DB_PORT:', process.env.DB_PORT);
  console.log('- DB_USER:', process.env.DB_USER);
  console.log('- DB_NAME:', process.env.DB_NAME);
  console.log('');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Database connection successful!');
    console.log('Connected to:', process.env.DB_NAME);

    await connection.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'ETIMEDOUT') {
      console.log('');
      console.log('Possible causes:');
      console.log('1. Wrong DB_HOST address');
      console.log('2. Database server is down');
      console.log('3. Firewall blocking connection');
      console.log('4. Wrong DB_PORT');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('');
      console.log('Possible causes:');
      console.log('1. Wrong DB_USER or DB_PASSWORD');
      console.log('2. User does not have permission');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('');
      console.log('Possible causes:');
      console.log('1. Database DB_NAME does not exist');
    }
  }
}

testConnection();
