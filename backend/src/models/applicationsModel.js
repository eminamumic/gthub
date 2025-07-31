const pool = require('../config/db')

async function getApplicationsByWorkshopId(workshopId) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, workshop_id, first_name, last_name, email, phone, date_of_birth, faculty_school, additional_text, source_channel, applied_at FROM workshop_applications WHERE workshop_id = ? ORDER BY applied_at DESC',
      [workshopId]
    )
    return rows
  } catch (error) {
    console.error('Greška pri dohvatanju prijava po ID-u radionice:', error)
    throw new Error('Greška pri dohvatanju prijava.')
  }
}

module.exports = {
  getApplicationsByWorkshopId,
}
