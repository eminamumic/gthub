const express = require('express')
const workshopsController = require('../controllers/workshopsController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware.authenticateToken)

router.get('/', workshopsController.getWorkshops)

router.get('/:id', workshopsController.getWorkshop)

router.post('/', workshopsController.addWorkshop)

router.put('/:id', workshopsController.updateWorkshop)

router.delete('/:id', workshopsController.deleteWorkshop)

module.exports = router
