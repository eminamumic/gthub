const express = require('express')
const {
  getUsers,
  updateMembershipEndDate,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, getUsers)

router.put('/:id', protect, updateMembershipEndDate)

module.exports = router
