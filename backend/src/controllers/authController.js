const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const loginAdmin = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Korisničko ime i lozinka su obavezni.' })
  }

  try {
    const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [
      username,
    ])

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'Pogrešno korisničko ime ili lozinka.' })
    }

    const admin = rows[0]

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Pogrešno korisničko ime ili lozinka.' })
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({
      message: 'Uspješna prijava!',
      token: token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    })
  } catch (error) {
    console.error('Greška pri prijavi:', error)
    res.status(500).json({ message: 'Greška servera pri prijavi.' })
  }
}

module.exports = {
  loginAdmin,
}
