const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/authRoutes')
const membersRoutes = require('./src/routes/membersRoutes')
const workshopsRoutes = require('./src/routes/workshopsRoutes')
const applicationsRoutes = require('./src/routes/applicationsRoutes')
require('dotenv').config()

const db = require('./src/config/db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/members', membersRoutes)
app.use('/api/workshops', workshopsRoutes)
app.use('/api/applications', applicationsRoutes)

app.get('/', (req, res) => {
  res.send('GTHub Admin Backend je pokrenut!')
})

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`)
  console.log(`Pristupite na: http://localhost:${PORT}`)
})
