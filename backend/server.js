require('dotenv').config()

const express = require('express')
const cors = require('cors')
const db = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('GTHub Admin Backend API is running!')
})

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution')
    res.json({
      message: 'Database query successful!',
      solution: rows[0].solution,
    })
  } catch (error) {
    console.error('Error executing DB query:', error)
    res
      .status(500)
      .json({ message: 'Database query failed!', error: error.message })
  }
})

app.use('/api', authRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Access at: http://localhost:${PORT}`)
})
