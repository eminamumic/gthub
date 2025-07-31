const express = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', authController.login)
router.post('/setup-admin', authController.setupAdmin)
router.post(
  '/change-password',
  authMiddleware.authenticateToken,
  authController.changePassword
)

module.exports = router
