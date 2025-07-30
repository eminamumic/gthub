const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/authRoutes')
require('dotenv').config()

const db = require('./src/config/db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('GTHub Admin Backend je pokrenut!')
})

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`)
  console.log(`Pristupite na: http://localhost:${PORT}`)
})
