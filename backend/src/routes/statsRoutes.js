const express = require('express')
const statsController = require('../controllers/statsController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get(
  '/dashboard',
  authMiddleware.authenticateToken,
  statsController.getDashboardStats
)

module.exports = router
