const express = require('express')
const {
  getWorkshops,
  createWorkshop,
} = require('../controllers/workshopController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getWorkshops)

router.post('/', protect, createWorkshop)

module.exports = router
