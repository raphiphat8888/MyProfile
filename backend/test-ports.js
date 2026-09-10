const mysql = require('mysql2/promise');
require('dotenv').config();

const possiblePorts = [3306, 3307, 3308, 8889, 9030];
const host = process.env.DB_HOST || '119.59.102.161';

async function testPort(port) {
  console.log(`Testing ${host}:${port}...`);

  try {
    const connection = await mysql.createConnection({
      host: host,
      port: port,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

    console.log(`✅ SUCCESS: Connected on port ${port}`);
    await connection.end();
    return port;
  } catch (error) {
    console.log(`❌ FAILED: Port ${port} - ${error.code}`);
    return null;
  }
}

async function testAllPorts() {
  console.log('Testing different MySQL ports...\n');

  for (const port of possiblePorts) {
    const successPort = await testPort(port);
    if (successPort) {
      console.log(`\n🎉 Found working port: ${successPort}`);
      console.log(`Update your .env file: DB_PORT=${successPort}`);
      return successPort;
    }
  }

  console.log('\n❌ No working port found');
  console.log('Possible causes:');
  console.log('1. MySQL server is not running');
  console.log('2. Firewall blocking all MySQL ports');
  console.log('3. Wrong IP address');
  console.log('4. MySQL configured to accept only local connections');
}

testAllPorts();
