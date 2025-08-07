const workshopModel = require('../models/workshopModel')

async function getWorkshops(req, res) {
  try {
    const workshops = await workshopModel.getAllWorkshops()
    res.status(200).json(workshops)
  } catch (error) {
    console.error('Error fetching workshops (controller):', error.message)
    res
      .status(500)
      .json({ message: 'Internal server error fetching workshops.' })
  }
}

async function getWorkshop(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Workshop ID must be a number.' })
  }

  try {
    const workshop = await workshopModel.getWorkshopById(id)
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found.' })
    }
    res.status(200).json(workshop)
  } catch (error) {
    console.error('Error fetching workshop by ID (controller):', error.message)
    res
      .status(500)
      .json({ message: 'Internal server error fetching workshop.' })
  }
}

async function addWorkshop(req, res) {
  const { name } = req.body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      message: 'Workshop name is required and must be a valid string.',
    })
  }

  try {
    const newWorkshop = await workshopModel.addWorkshop(name.trim())
    res
      .status(201)
      .json({ message: 'Workshop successfully added!', workshop: newWorkshop })
  } catch (error) {
    console.error('Error adding workshop (controller):', error.message)
    if (error.message.includes('A workshop with this name already exists.')) {
      return res
        .status(409)
        .json({ message: 'A workshop with the entered name already exists.' })
    }
    res.status(500).json({ message: 'Internal server error adding workshop.' })
  }
}

async function updateWorkshop(req, res) {
  const { id } = req.params
  const { name } = req.body

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Workshop ID must be a number.' })
  }
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      message:
        'Workshop name is required for an update and must be a valid string.',
    })
  }

  try {
    const success = await workshopModel.updateWorkshop(id, name.trim())
    if (!success) {
      return res.status(404).json({ message: 'Workshop not found.' })
    }
    res.status(200).json({ message: 'Workshop successfully updated!' })
  } catch (error) {
    console.error('Error updating workshop (controller):', error.message)
    if (error.message.includes('A workshop with this name already exists.')) {
      return res
        .status(409)
        .json({ message: 'A workshop with the entered name already exists.' })
    }
    res
      .status(500)
      .json({ message: 'Internal server error updating workshop.' })
  }
}

async function deleteWorkshop(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Workshop ID must be a number.' })
  }

  try {
    const success = await workshopModel.deleteWorkshop(id)
    if (!success) {
      return res.status(404).json({ message: 'Workshop not found.' })
    }
    res.status(200).json({ message: 'Workshop successfully deleted.' })
  } catch (error) {
    console.error('Error deleting workshop (controller):', error.message)
    res
      .status(500)
      .json({ message: 'Internal server error deleting workshop.' })
  }
}

module.exports = {
  getWorkshops,
  getWorkshop,
  addWorkshop,
  updateWorkshop,
  deleteWorkshop,
}
