const workshopModel = require('../models/workshopModel')

async function getWorkshops(req, res) {
  try {
    const workshops = await workshopModel.getAllWorkshops()
    res.status(200).json(workshops)
  } catch (error) {
    console.error('Greška pri dohvaćanju radionica (kontroler):', error.message)
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dohvaćanju radionica.' })
  }
}

async function getWorkshop(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: 'ID radionice mora biti numerički.' })
  }

  try {
    const workshop = await workshopModel.getWorkshopById(id)
    if (!workshop) {
      return res.status(404).json({ message: 'Radionica nije pronađena.' })
    }
    res.status(200).json(workshop)
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju radionice po ID-u (kontroler):',
      error.message
    )
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dohvaćanju radionice.' })
  }
}

async function addWorkshop(req, res) {
  const { name } = req.body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      message: 'Naziv radionice je obavezan i mora biti validan string.',
    })
  }

  try {
    const newWorkshop = await workshopModel.addWorkshop(name.trim())
    res
      .status(201)
      .json({ message: 'Radionica uspješno dodana!', workshop: newWorkshop })
  } catch (error) {
    console.error('Greška pri dodavanju radionice (kontroler):', error.message)
    if (error.message.includes('Radionica sa ovim nazivom već postoji.')) {
      return res
        .status(409)
        .json({ message: 'Radionica sa unesenim nazivom već postoji.' })
    }
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dodavanju radionice.' })
  }
}

async function updateWorkshop(req, res) {
  const { id } = req.params
  const { name } = req.body

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: 'ID radionice mora biti numerički.' })
  }
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      message:
        'Naziv radionice je obavezan za ažuriranje i mora biti validan string.',
    })
  }

  try {
    const success = await workshopModel.updateWorkshop(id, name.trim())
    if (!success) {
      return res.status(404).json({ message: 'Radionica nije pronađena.' })
    }
    res.status(200).json({ message: 'Radionica uspješno ažurirana!' })
  } catch (error) {
    console.error('Greška pri ažuriranju radionice (kontroler):', error.message)
    if (error.message.includes('Radionica sa ovim nazivom već postoji.')) {
      return res
        .status(409)
        .json({ message: 'Radionica sa unesenim nazivom već postoji.' })
    }
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri ažuriranju radionice.' })
  }
}

async function deleteWorkshop(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: 'ID radionice mora biti numerički.' })
  }

  try {
    const success = await workshopModel.deleteWorkshop(id)
    if (!success) {
      return res.status(404).json({ message: 'Radionica nije pronađena.' })
    }
    res.status(200).json({ message: 'Radionica uspješno obrisana.' })
  } catch (error) {
    console.error('Greška pri brisanju radionice (kontroler):', error.message)
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri brisanju radionice.' })
  }
}

module.exports = {
  getWorkshops,
  getWorkshop,
  addWorkshop,
  updateWorkshop,
  deleteWorkshop,
}
