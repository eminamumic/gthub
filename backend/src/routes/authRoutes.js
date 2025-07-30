const express = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', authController.login)
router.post('/setup-admin', authController.setupAdmin)
router.put(
  '/change-password',
  authMiddleware.authenticateToken,
  authController.changePassword
)

module.exports = router
