const applicationModel = require('../models/applicationModel')
const workshopModel = require('../models/workshopModel')
const { Parser } = require('json2csv')

const isValidDate = (dateString) => {
  return dateString && !isNaN(new Date(dateString).getTime())
}

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function getApplications(req, res) {
  const { search, workshopId, sourceChannel } = req.query

  const options = {
    search: search || null,
    workshopId: workshopId ? parseInt(workshopId) : null,
    sourceChannel: sourceChannel || null,
  }

  try {
    const applications = await applicationModel.getAllApplications(options)
    res.status(200).json(applications)
  } catch (error) {
    console.error(
      'Error fetching applications (controller, with filters):',
      error.message
    )
    res
      .status(500)
      .json({ message: 'Internal server error fetching applications.' })
  }
}

async function getApplication(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Application ID must be a number.' })
  }

  try {
    const application = await applicationModel.getApplicationById(id)
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' })
    }
    res.status(200).json(application)
  } catch (error) {
    console.error(
      'Error fetching application by ID (controller):',
      error.message
    )
    res
      .status(500)
      .json({ message: 'Internal server error fetching application.' })
  }
}

async function addApplication(req, res) {
  const {
    workshop_id,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    faculty_school,
    additional_text,
    source_channel,
  } = req.body

  if (!workshop_id || !first_name || !last_name || !email || !source_channel) {
    return res.status(400).json({
      message:
        'Workshop ID, first name, last name, email, and source channel are required.',
    })
  }
  if (isNaN(workshop_id)) {
    return res.status(400).json({ message: 'Workshop ID must be a number.' })
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address format.' })
  }
  if (date_of_birth && !isValidDate(date_of_birth)) {
    return res
      .status(400)
      .json({ message: 'Date of birth must be a valid date (YYYY-MM-DD).' })
  }

  const validSourceChannels = ['Facebook', 'Instagram', 'LinkedIn', 'Other']
  if (!validSourceChannels.includes(source_channel)) {
    return res.status(400).json({
      message: `Source channel must be one of: ${validSourceChannels.join(
        ', '
      )}.`,
    })
  }

  try {
    const workshopExists = await workshopModel.getWorkshopById(workshop_id)
    if (!workshopExists) {
      return res
        .status(400)
        .json({ message: 'Workshop with the specified ID does not exist.' })
    }

    const applicationData = {
      workshop_id,
      first_name,
      last_name,
      email,
      phone: phone || null,
      date_of_birth: date_of_birth || null,
      faculty_school: faculty_school || null,
      additional_text: additional_text || null,
      source_channel,
    }

    const newApplication = await applicationModel.addApplication(
      applicationData
    )
    res.status(201).json({
      message: 'Application successfully submitted!',
      application: newApplication,
    })
  } catch (error) {
    console.error('Error adding application (controller):', error.message)
    if (
      error.message.includes('Workshop with the specified ID does not exist.')
    ) {
      return res.status(400).json({ message: error.message })
    }
    res
      .status(500)
      .json({ message: 'Internal server error adding application.' })
  }
}

async function deleteApplication(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Application ID must be a number.' })
  }

  try {
    const success = await applicationModel.deleteApplication(id)
    if (!success) {
      return res.status(404).json({ message: 'Application not found.' })
    }
    res.status(200).json({ message: 'Application successfully deleted.' })
  } catch (error) {
    console.error('Error deleting application (controller):', error.message)
    res
      .status(500)
      .json({ message: 'Internal server error deleting application.' })
  }
}

async function exportApplicationsCsv(req, res) {
  try {
    const applications = await applicationModel.getAllApplications()

    const fields = [
      { label: 'Application ID', value: 'id' },
      { label: 'Workshop ID', value: 'workshop_id' },
      { label: 'Workshop Name', value: 'workshop_name' },
      { label: 'First Name', value: 'first_name' },
      { label: 'Last Name', value: 'last_name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Date of Birth', value: 'date_of_birth' },
      { label: 'Faculty/School', value: 'faculty_school' },
      { label: 'Additional Text', value: 'additional_text' },
      { label: 'Source Channel', value: 'source_channel' },
      { label: 'Applied At', value: 'applied_at' },
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(applications)

    res.header('Content-Type', 'text/csv')
    res.attachment('gthub_applications.csv')
    res.send(csv)
  } catch (error) {
    console.error('Error exporting applications to CSV:', error.message)
    res
      .status(500)
      .json({ message: 'Internal server error exporting applications.' })
  }
}

module.exports = {
  getApplications,
  getApplication,
  addApplication,
  deleteApplication,
  exportApplicationsCsv,
}
