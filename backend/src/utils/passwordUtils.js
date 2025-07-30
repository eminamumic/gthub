const bcrypt = require('bcryptjs')

const saltRounds = 10

async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    console.error('Greška pri heširanju lozinke:', error)
    throw new Error('Greška pri heširanju lozinke.')
  }
}

async function comparePassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    console.error('Greška pri poređenju lozinki:', error)
    throw new Error('Greška pri poređenju lozinki.')
  }
}

module.exports = {
  hashPassword,
  comparePassword,
}
