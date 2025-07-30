const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
})

pool
  .getConnection()
  .then((connection) => {
    console.log('Uspješno povezan na MySQL bazu podataka!')
    connection.release()
  })
  .catch((err) => {
    console.error('Greška pri konekciji na MySQL bazu podataka:', err.message)
    process.exit(1)
  })

module.exports = pool
