const mysql = require('mysql2');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'analytics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL as ID ' + connection.threadId);

  connection.release();
});

module.exports = pool;
