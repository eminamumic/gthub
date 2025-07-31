const pool = require('../config/db')

async function getAllWorkshops() {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, created_at FROM workshops ORDER BY name ASC'
    )
    return rows
  } catch (error) {
    console.error('Greška pri dohvaćanju svih radionica:', error)
    throw new Error('Greška pri dohvaćanju radionica.')
  }
}

async function getWorkshopById(id) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, created_at FROM workshops WHERE id = ?',
      [id]
    )
    return rows[0] || null
  } catch (error) {
    console.error('Greška pri dohvaćanju radionice po ID-u:', error)
    throw new Error('Greška pri dohvaćanju radionice.')
  }
}

async function addWorkshop(name) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO workshops (name) VALUES (?)',
      [name]
    )
    return { id: result.insertId, name }
  } catch (error) {
    console.error('Greška pri dodavanju nove radionice:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Radionica sa ovim nazivom već postoji.')
    }
    // ISPRAVLJENO: Ovde je bio typo
    throw new Error('Greška pri dodavanju radionice.')
  }
}

async function updateWorkshop(id, name) {
  try {
    const [result] = await pool.execute(
      'UPDATE workshops SET name = ? WHERE id = ?',
      [name, id]
    )
    return result.affectedRows > 0
  } catch (error) {
    console.error('Greška pri ažuriranju radionice:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Radionica sa ovim nazivom već postoji.')
    }
    throw new Error('Greška pri ažuriranju radionice.')
  }
}

async function deleteWorkshop(id) {
  try {
    const [result] = await pool.execute('DELETE FROM workshops WHERE id = ?', [
      id,
    ])
    return result.affectedRows > 0
  } catch (error) {
    console.error('Greška pri brisanju radionice:', error)
    throw new Error('Greška pri brisanju radionice.')
  }
}

module.exports = {
  getAllWorkshops,
  getWorkshopById,
  addWorkshop,
  updateWorkshop,
  deleteWorkshop,
}
