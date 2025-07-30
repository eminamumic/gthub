const express = require('express')
const applicationsController = require('../controllers/applicationsController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware.authenticateToken)

router.get('/export', applicationsController.exportApplicationsCsv)

router.get('/', applicationsController.getApplications)

router.get('/:id', applicationsController.getApplication)

router.post('/', applicationsController.addApplication)

router.delete('/:id', applicationsController.deleteApplication)

module.exports = router
