require('dotenv').config()

const mysql = require('mysql2')

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
})

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error(
        'Database connection was refused. Check your DB credentials or if the MySQL server is running.'
      )
    }
    console.error('Error connecting to the database:', err.message)
    return
  }
  console.log('Successfully connected to the database!')
  connection.release()
})

module.exports = pool.promise()
