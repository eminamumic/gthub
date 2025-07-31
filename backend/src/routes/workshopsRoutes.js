const express = require('express')
const router = express.Router()
// Uvezite vaš model
const workshopsModel = require('../models/workshopModel')

// GET /api/workshops - Dohvati sve radionice
router.get('/', async (req, res) => {
  try {
    const workshops = await workshopsModel.getAllWorkshops()
    res.json(workshops)
  } catch (error) {
    res.status(500).json({ message: 'Greška pri dohvatanju radionica.' })
  }
})

// POST /api/workshops - Unos nove radionice
router.post('/', async (req, res) => {
  const { name } = req.body
  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Naziv radionice je obavezan.' })
    }
    const newWorkshop = await workshopsModel.addWorkshop(name)
    res.status(201).json(newWorkshop)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
