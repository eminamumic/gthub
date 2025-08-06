const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME, // Promijenjeno u DB_USERNAME
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // Promijenjeno u DB_DATABASE
  waitForConnections: true,
  port: process.env.DB_PORT, // Dodano
})

pool
  .getConnection()
  .then((connection) => {
    console.log('Uspješno povezan na MySQL bazu podataka!')
    connection.release() // Bitno je osloboditi konekciju nakon provjere
  })
  .catch((err) => {
    console.error('Greška pri konekciji na MySQL bazu podataka:', err.message)
  })

module.exports = pool
