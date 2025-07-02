const db = require('../config/db')

const getWorkshops = async (req, res) => {
  try {
    const [workshops] = await db.query(
      'SELECT * FROM Workshops ORDER BY date DESC'
    )
    res.json(workshops)
  } catch (error) {
    console.error('Greška pri dohvatanju radionica:', error)
    res
      .status(500)
      .json({ message: 'Greška servera pri dohvatanju radionica.' })
  }
}

const createWorkshop = async (req, res) => {
  const { name, description, date, location, speaker } = req.body

  if (!name || !date) {
    return res
      .status(400)
      .json({ message: 'Naziv i datum radionice su obavezni.' })
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM Workshops WHERE name = ? AND date = ?',
      [name, date]
    )
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: 'Radionica s ovim nazivom i datumom već postoji.' })
    }

    const [result] = await db.query(
      'INSERT INTO Workshops (name, description, date, location, speaker) VALUES (?, ?, ?, ?, ?)',
      [name, description, date, location, speaker]
    )

    res.status(201).json({
      message: 'Radionica uspješno dodana!',
      workshopId: result.insertId,
    })
  } catch (error) {
    console.error('Greška pri dodavanju radionice:', error)
    res.status(500).json({ message: 'Greška servera pri dodavanju radionice.' })
  }
}

module.exports = {
  getWorkshops,
  createWorkshop,
}
