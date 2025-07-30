const jwt = require('jsonwebtoken')
const adminModel = require('../models/adminModel')
const { comparePassword, hashPassword } = require('../utils/passwordUtils')
const { jwtSecret, jwtExpiresIn } = require('../config/jwt')

async function login(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Korisničko ime i lozinka su obavezni.' })
  }

  try {
    const admin = await adminModel.findAdminByUsername(username)
    if (!admin) {
      return res
        .status(401)
        .json({ message: 'Pogrešno korisničko ime ili lozinka.' })
    }

    const isMatch = await comparePassword(password, admin.password_hash)
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Pogrešno korisničko ime ili lozinka.' })
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    )

    res.status(200).json({
      message: 'Uspješna prijava!',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    })
  } catch (error) {
    console.error('Greška pri prijavi:', error)
    res.status(500).json({ message: 'Interna serverska greška.' })
  }
}

async function setupAdmin(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Korisničko ime i lozinka su obavezni.' })
  }

  try {
    const hashedPassword = await hashPassword(password)
    const newAdmin = await adminModel.createAdmin(username, hashedPassword)
    res
      .status(201)
      .json({ message: 'Inicijalni admin uspješno kreiran!', admin: newAdmin })
  } catch (error) {
    console.error('Greška pri setupu admina:', error)
    res.status(500).json({
      message: error.message || 'Greška pri kreiranju inicijalnog admina.',
    })
  }
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body
  const adminId = req.user.id

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Stara i nova lozinka su obavezne.' })
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: 'Nova lozinka mora imati najmanje 6 znakova.' })
  }
  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ message: 'Nova lozinka ne smije biti ista kao stara.' })
  }

  try {
    const admin = await adminModel.findAdminByUsername(req.user.username) // req.user.username dolazi iz tokena
    if (!admin) {
      return res.status(404).json({ message: 'Admin korisnik nije pronađen.' })
    }

    const isMatch = await comparePassword(oldPassword, admin.password_hash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Pogrešna stara lozinka.' })
    }

    const hashedPassword = await hashPassword(newPassword)
    await pool.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [
      hashedPassword,
      adminId,
    ])

    res.status(200).json({ message: 'Lozinka uspješno promijenjena.' })
  } catch (error) {
    console.error('Greška pri promjeni lozinke:', error)
    res.status(500).json({ message: 'Interna serverska greška.' })
  }
}

module.exports = {
  login,
  setupAdmin,
  changePassword,
}
