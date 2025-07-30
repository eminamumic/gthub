const express = require('express')
const membersController = require('../controllers/membersController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware.authenticateToken)

router.get('/export', membersController.exportMembersCsv)

router.get('/', membersController.getMembers)

router.get('/:id', membersController.getMember)

router.post('/', membersController.addMember)

router.put('/:id', membersController.updateMember)

router.delete('/:id', membersController.deleteMember)

module.exports = router
