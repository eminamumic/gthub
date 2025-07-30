const pool = require('../config/db')

async function getAllMembers(options = {}) {
  let query = `
        SELECT 
            id, 
            first_name, 
            last_name, 
            date_of_birth, 
            email, 
            phone, 
            faculty, 
            membership_start_date, 
            membership_expiry_date 
        FROM gthub_members 
    `
  const params = []
  const conditions = []

  if (options.search) {
    const searchTerm = `%${options.search}%`
    conditions.push(`(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`)
    params.push(searchTerm, searchTerm, searchTerm)
  }

  if (options.expiringSoon) {
    conditions.push(
      `membership_expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)`
    )
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  query += ` ORDER BY membership_expiry_date ASC`

  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } catch (error) {
    console.error('Greška pri dohvaćanju svih članova (sa filterima):', error)
    throw new Error('Greška pri dohvaćanju članova.')
  }
}

async function getMemberById(id) {
  try {
    const [rows] = await pool.execute(
      `SELECT 
                id, 
                first_name, 
                last_name, 
                date_of_birth, 
                email, 
                phone, 
                faculty, 
                membership_start_date, 
                membership_expiry_date 
             FROM gthub_members 
             WHERE id = ?`,
      [id]
    )
    return rows[0] || null
  } catch (error) {
    console.error('Greška pri dohvaćanju člana po ID-u:', error)
    throw new Error('Greška pri dohvaćanju člana.')
  }
}

async function addMember(memberData) {
  const {
    first_name,
    last_name,
    date_of_birth,
    email,
    phone,
    faculty,
    membership_start_date,
    membership_expiry_date,
  } = memberData

  let final_expiry_date = membership_expiry_date
  if (!final_expiry_date) {
    const startDate = new Date(membership_start_date)
    startDate.setMonth(startDate.getMonth() + 1)
    final_expiry_date = startDate.toISOString().split('T')[0]
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO gthub_members 
             (first_name, last_name, date_of_birth, email, phone, faculty, membership_start_date, membership_expiry_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        date_of_birth,
        email,
        phone,
        faculty,
        membership_start_date,
        final_expiry_date,
      ]
    )
    return {
      id: result.insertId,
      ...memberData,
      membership_expiry_date: final_expiry_date,
    }
  } catch (error) {
    console.error('Greška pri dodavanju novog člana:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Član sa ovim emailom već postoji.')
    }
    throw new Error('Greška pri dodavanju člana.')
  }
}

async function updateMember(id, memberData) {
  const fields = []
  const values = []

  for (const key in memberData) {
    if (memberData.hasOwnProperty(key)) {
      fields.push(`${key} = ?`)
      values.push(memberData[key])
    }
  }

  if (fields.length === 0) {
    return false
  }

  values.push(id)

  try {
    const [result] = await pool.execute(
      `UPDATE gthub_members SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    return result.affectedRows > 0
  } catch (error) {
    console.error('Greška pri ažuriranju člana:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Email već postoji kod drugog člana.')
    }
    throw new Error('Greška pri ažuriranju člana.')
  }
}

async function deleteMember(id) {
  try {
    const [result] = await pool.execute(
      'DELETE FROM gthub_members WHERE id = ?',
      [id]
    )
    return result.affectedRows > 0
  } catch (error) {
    console.error('Greška pri brisanju člana:', error)
    throw new Error('Greška pri brisanju člana.')
  }
}

module.exports = {
  getAllMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
}
