const pool = require('../config/db')

async function findAdminByUsername(username) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, password_hash FROM admins WHERE username = ?',
      [username]
    )
    return rows[0] || null
  } catch (error) {
    console.error('Greška pri dohvaćanju admina po korisničkom imenu:', error)
    throw new Error('Greška pri dohvaćanju admina.')
  }
}

async function createAdmin(username, hashedPassword) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
      [username, hashedPassword]
    )
    return { id: result.insertId, username }
  } catch (error) {
    console.error('Greška pri kreiranju admina:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Korisničko ime već postoji.')
    }
    throw new Error('Greška pri kreiranju admina.')
  }
}

module.exports = {
  findAdminByUsername,
  createAdmin,
}
