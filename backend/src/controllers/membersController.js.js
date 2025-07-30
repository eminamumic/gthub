const db = require('config/db')

const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT * FROM Users ORDER BY membership_end_date ASC'
    )
    res.json(users)
  } catch (error) {
    console.error('Greška pri dohvatanju članova:', error)
    res.status(500).json({ message: 'Greška servera pri dohvatanju članova.' })
  }
}

const updateMembershipEndDate = async (req, res) => {
  const { id } = req.params
  const { membership_end_date } = req.body

  if (!membership_end_date) {
    return res
      .status(400)
      .json({ message: 'Datum isteka članarine je obavezan.' })
  }

  try {
    const [result] = await db.query(
      'UPDATE Users SET membership_end_date = ? WHERE id = ?',
      [membership_end_date, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Član nije pronađen.' })
    }

    res.json({ message: 'Datum isteka članarine uspješno ažuriran.' })
  } catch (error) {
    console.error('Greška pri ažuriranju datuma isteka članarine:', error)
    res
      .status(500)
      .json({ message: 'Greška servera pri ažuriranju članarine.' })
  }
}

module.exports = {
  getUsers,
  updateMembershipEndDate,
}
