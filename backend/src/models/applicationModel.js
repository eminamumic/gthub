const pool = require('../config/db')

async function getAllApplications(options = {}) {
  let query = `
        SELECT 
            wa.id, 
            wa.workshop_id, 
            w.name AS workshop_name,
            wa.first_name, 
            wa.last_name, 
            wa.email, 
            wa.phone, 
            wa.date_of_birth, 
            wa.faculty_school, 
            wa.additional_text, 
            wa.source_channel, 
            wa.applied_at
         FROM workshop_applications wa
         JOIN workshops w ON wa.workshop_id = w.id
    `
  const params = []
  const conditions = []

  if (options.search) {
    const searchTerm = `%${options.search}%`
    conditions.push(
      `(wa.first_name LIKE ? OR wa.last_name LIKE ? OR wa.email LIKE ?)`
    )
    params.push(searchTerm, searchTerm, searchTerm)
  }

  if (options.workshopId) {
    conditions.push(`wa.workshop_id = ?`)
    params.push(options.workshopId)
  }

  if (options.sourceChannel) {
    conditions.push(`wa.source_channel = ?`)
    params.push(options.sourceChannel)
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  query += ` ORDER BY wa.applied_at DESC`

  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } catch (error) {
    console.error('Greška pri dohvaćanju svih prijava (sa filterima):', error)
    throw new Error('Greška pri dohvaćanju prijava.')
  }
}

async function getApplicationById(id) {
  try {
    const [rows] = await pool.execute(
      `SELECT 
                wa.id, 
                wa.workshop_id, 
                w.name AS workshop_name,
                wa.first_name, 
                wa.last_name, 
                wa.email, 
                wa.phone, 
                wa.date_of_birth, 
                wa.faculty_school, 
                wa.additional_text, 
                wa.source_channel, 
                wa.applied_at
             FROM workshop_applications wa
             JOIN workshops w ON wa.workshop_id = w.id
             WHERE wa.id = ?`,
      [id]
    )
    return rows[0] || null
  } catch (error) {
    console.error('Greška pri dohvaćanju prijave po ID-u:', error)
    throw new Error('Greška pri dohvaćanju prijave.')
  }
}

async function addApplication(applicationData) {
  const {
    workshop_id,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    faculty_school,
    additional_text,
    source_channel,
  } = applicationData

  try {
    const [result] = await pool.execute(
      `INSERT INTO workshop_applications 
             (workshop_id, first_name, last_name, email, phone, date_of_birth, faculty_school, additional_text, source_channel) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        workshop_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        faculty_school,
        additional_text,
        source_channel,
      ]
    )
    return { id: result.insertId, ...applicationData }
  } catch (error) {
    console.error('Greška pri dodavanju nove prijave:', error)

    if (
      error.code === 'ER_NO_REFERENCED_ROW_2' ||
      error.code === 'ER_NO_REFERENCED_PARENT_2'
    ) {
      throw new Error('Radionica sa navedenim ID-em ne postoji.')
    }
    throw new Error('Greška pri dodavanju prijave.')
  }
}

async function deleteApplication(id) {
  try {
    const [result] = await pool.execute(
      'DELETE FROM workshop_applications WHERE id = ?',
      [id]
    )
    return result.affectedRows > 0
  } catch (error) {
    console.error('Greška pri brisanju prijave:', error)
    throw new Error('Greška pri brisanju prijave.')
  }
}

module.exports = {
  getAllApplications,
  getApplicationById,
  addApplication,
  deleteApplication,
}
