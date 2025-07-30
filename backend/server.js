require('dotenv').config()

const express = require('express')
const cors = require('cors')
const db = require('config/db')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const workshopRoutes = require('./routes/workshopRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/workshop', workshopRoutes)

app.get('/', (req, res) => {
  res.send('Eminina Aplikacijca')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Access at: http://localhost:${PORT}`)
})

const plainPassword = 'mojalozinka123' // Tvoja željena lozinka
