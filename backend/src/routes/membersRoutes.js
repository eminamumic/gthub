const express = require('express')
const membersController = require('../controllers/membersController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware.authenticateToken)

router.get('/', membersController.getMembers)

router.get('/:id', membersController.getMember)

router.post('/', membersController.addMember)

router.put('/:id', membersController.updateMember)

router.delete('/:id', membersController.deleteMember)

router.get('/export', membersController.exportMembersCsv)

module.exports = router
