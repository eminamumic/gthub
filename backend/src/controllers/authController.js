const jwt = require('jsonwebtoken')
const adminModel = require('../models/adminModel')
const { comparePassword, hashPassword } = require('../utils/passwordUtils')
const { jwtSecret, jwtExpiresIn } = require('../config/jwt')

async function login(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' })
  }

  try {
    const admin = await adminModel.findAdminByUsername(username)
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password.' })
    }

    const isMatch = await comparePassword(password, admin.password_hash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' })
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    )

    res.status(200).json({
      message: 'Login successful!',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

async function setupAdmin(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' })
  }

  try {
    const existingAdmin = await adminModel.findAdminByUsername(username)
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin user already exists.' })
    }

    const hashedPassword = await hashPassword(password)
    const newAdmin = await adminModel.createAdmin(username, hashedPassword)
    res
      .status(201)
      .json({ message: 'Initial admin created successfully!', admin: newAdmin })
  } catch (error) {
    console.error('Admin setup error:', error)
    res.status(500).json({
      message: 'Error creating the initial admin.',
    })
  }
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body
  const adminId = req.user.id

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Old and new passwords are required.' })
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: 'New password must be at least 6 characters long.' })
  }
  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ message: 'New password cannot be the same as the old one.' })
  }

  try {
    const admin = await adminModel.findAdminById(adminId)
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found.' })
    }

    const isMatch = await comparePassword(oldPassword, admin.password_hash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect old password.' })
    }

    const hashedPassword = await hashPassword(newPassword)
    await adminModel.updateAdminPassword(adminId, hashedPassword)

    res.status(200).json({ message: 'Password changed successfully.' })
  } catch (error) {
    console.error('Password change error:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  login,
  setupAdmin,
  changePassword,
}
