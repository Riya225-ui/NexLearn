

require('dotenv').config();
const mysql2 = require('mysql2/promise');

const password = process.argv[2] || process.env.DB_PASSWORD || '';

async function setup() {
  console.log('🔧 NexLearn AI - Database Setup');
  console.log('==================================');

  let connection;
  try {
    console.log(`\n📡 Connecting to MySQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}...`);
    connection = await mysql2.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: password,
    });

    console.log('✅ Connected to MySQL!');

    const dbName = process.env.DB_NAME || 'nexlearn_db';
    console.log(`\n📦 Creating database "${dbName}" if it doesn't exist...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database "${dbName}" is ready!`);

    
    const [rows] = await connection.execute(`SHOW DATABASES LIKE '${dbName}'`);
    if (rows.length > 0) {
      console.log(`\n🎉 Setup complete! Database "${dbName}" exists and is ready to use.`);
      console.log('\n📋 Next steps:');
      console.log('   1. Make sure DB_PASSWORD in backend/.env matches your MySQL root password.');
      console.log('   2. Run: cd backend && npm run dev');
      console.log('   3. The Sequelize ORM will auto-create all tables on first start.\n');
    }
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    if (error.code === 'ECONNREFUSED') {
      console.log('   • MySQL server is not running. Please start it first.');
      console.log('   • On Windows: Open Services, find "MySQL80", right-click → Start');
      console.log('   • Or run: net start MySQL80');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   • Wrong password! Run: node db-setup.js YOUR_MYSQL_PASSWORD');
      console.log('   • Then update DB_PASSWORD in backend/.env');
    } else {
      console.log('   • Check that MySQL is installed and running.');
    }
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setup();
