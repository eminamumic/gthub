const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  port: process.env.DB_PORT,
})

pool
  .getConnection()
  .then((connection) => {
    console.log('Successfully connected to the MySQL database!')
    connection.release()
  })
  .catch((err) => {
    console.error('Error connecting to the MySQL database:', err.message)
  })

module.exports = pool
