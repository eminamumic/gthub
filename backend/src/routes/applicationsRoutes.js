const express = require('express')
const router = express.Router()
const applicationsModel = require('../models/applicationsModel')

router.get('/workshop/:workshopId', async (req, res) => {
  const { workshopId } = req.params
  try {
    const applications = await applicationsModel.getApplicationsByWorkshopId(
      workshopId
    )
    res.json(applications)
  } catch (error) {
    console.error('Greška u ruti za prijave:', error)
    res.status(500).json({ message: 'Greška pri dohvatanju prijava.' })
  }
})

module.exports = router
