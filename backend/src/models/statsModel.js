const pool = require('../config/db')

async function getTotalMembers() {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS total FROM gthub_members'
  )
  return rows[0].total
}

async function getExpiringMembersCount(days = 30) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total 
         FROM gthub_members 
         WHERE membership_expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)`,
    [days]
  )
  return rows[0].total
}

async function getTotalWorkshops() {
  const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM workshops')
  return rows[0].total
}

async function getTotalApplications() {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS total FROM workshop_applications'
  )
  return rows[0].total
}

async function getApplicationsByWorkshop() {
  const [rows] = await pool.execute(
    `SELECT 
            w.name AS workshop_name, 
            COUNT(wa.id) AS application_count
         FROM workshops w
         LEFT JOIN workshop_applications wa ON w.id = wa.workshop_id
         GROUP BY w.id, w.name
         ORDER BY w.name ASC`
  )
  return rows
}

async function getApplicationsBySourceChannel() {
  const [rows] = await pool.execute(
    `SELECT 
            source_channel, 
            COUNT(*) AS total
         FROM workshop_applications
         GROUP BY source_channel
         ORDER BY total DESC`
  )
  return rows
}

module.exports = {
  getTotalMembers,
  getExpiringMembersCount,
  getTotalWorkshops,
  getTotalApplications,
  getApplicationsByWorkshop,
  getApplicationsBySourceChannel,
}
