const mysql = require('mysql2/promise');
require('dotenv').config();

// Test 1: Without database specified first
async function testConnectionWithoutDB() {
  console.log('Test 1: Connection without database specified...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectTimeout: 5000,
    });

    console.log('✅ Connected to MySQL server (no database)');
    await connection.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed: ${error.code} - ${error.message}`);
    return false;
  }
}

// Test 2: With different connection options
async function testWithDifferentOptions() {
  console.log('\nTest 2: Connection with different options...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
      multipleStatements: false,
      namedPlaceholders: true,
    });

    console.log('✅ Connected with different options');
    await connection.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed: ${error.code} - ${error.message}`);
    return false;
  }
}

// Test 3: Ping test
async function testPing() {
  console.log('\nTest 3: Basic ping test...');
  try {
    // Try to create a minimal connection just to test reachability
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectTimeout: 3000,
    });

    const [result] = await connection.execute('SELECT 1 as ping');
    console.log('✅ Ping successful:', result[0]);
    await connection.end();
    return true;
  } catch (error) {
    console.log(`❌ Ping failed: ${error.code} - ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('Running alternative connection tests...\n');
  console.log('Configuration:');
  console.log('- DB_HOST:', process.env.DB_HOST);
  console.log('- DB_PORT:', process.env.DB_PORT);
  console.log('- DB_USER:', process.env.DB_USER);
  console.log('');

  const test1 = await testConnectionWithoutDB();
  const test2 = await testWithDifferentOptions();
  const test3 = await testPing();

  console.log('\n=== Results ===');
  console.log('Test 1 (No DB):', test1 ? '✅' : '❌');
  console.log('Test 2 (Different Options):', test2 ? '✅' : '❌');
  console.log('Test 3 (Ping):', test3 ? '✅' : '❌');

  if (!test1 && !test2 && !test3) {
    console.log('\n❌ All connection methods failed');
    console.log('Recommended solutions:');
    console.log('1. Contact database administrator');
    console.log('2. Use SSH tunneling if database is behind firewall');
    console.log('3. Use VPN if database is in private network');
    console.log('4. Set up local MySQL for development');
  }
}

runAllTests();
