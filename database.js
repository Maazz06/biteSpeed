const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

let connection;

async function connectDatabase() {
  try {
    connection = await mysql.createConnection(process.env.DB_URL);
    console.log('Successfully connected to MySQL via URL!');
  } catch (err) {
    console.log('Connection Error:', err.message);
  }
}

module.exports = {
  connectDatabase,
  getConnection: () => connection
};
