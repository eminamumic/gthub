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
      'Greška pri dohvaćanju prijava (kontroler, sa filterima):',
      error.message
    )
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dohvaćanju prijava.' })
  }
}

async function getApplication(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID prijave mora biti numerički.' })
  }

  try {
    const application = await applicationModel.getApplicationById(id)
    if (!application) {
      return res.status(404).json({ message: 'Prijava nije pronađena.' })
    }
    res.status(200).json(application)
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju prijave po ID-u (kontroler):',
      error.message
    )
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dohvaćanju prijave.' })
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
      message: 'ID radionice, ime, prezime, email i kanal prijave su obavezni.',
    })
  }
  if (isNaN(workshop_id)) {
    return res
      .status(400)
      .json({ message: 'ID radionice mora biti numerički.' })
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: 'Unesite ispravan format email adrese.' })
  }
  if (date_of_birth && !isValidDate(date_of_birth)) {
    return res
      .status(400)
      .json({ message: 'Datum rođenja mora biti validan datum (YYYY-MM-DD).' })
  }

  const validSourceChannels = ['Facebook', 'Instagram', 'LinkedIn', 'Other']
  if (!validSourceChannels.includes(source_channel)) {
    return res.status(400).json({
      message: `Kanal prijave mora biti jedan od: ${validSourceChannels.join(
        ', '
      )}.`,
    })
  }

  try {
    const workshopExists = await workshopModel.getWorkshopById(workshop_id)
    if (!workshopExists) {
      return res
        .status(400)
        .json({ message: 'Radionica sa navedenim ID-em ne postoji.' })
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
      message: 'Prijava uspješno poslana!',
      application: newApplication,
    })
  } catch (error) {
    console.error('Greška pri dodavanju prijave (kontroler):', error.message)
    if (error.message.includes('Radionica sa navedenim ID-em ne postoji.')) {
      return res.status(400).json({ message: error.message })
    }
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dodavanju prijave.' })
  }
}

async function deleteApplication(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID prijave mora biti numerički.' })
  }

  try {
    const success = await applicationModel.deleteApplication(id)
    if (!success) {
      return res.status(404).json({ message: 'Prijava nije pronađena.' })
    }
    res.status(200).json({ message: 'Prijava uspješno obrisana.' })
  } catch (error) {
    console.error('Greška pri brisanju prijave (kontroler):', error.message)
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri brisanju prijave.' })
  }
}

async function exportApplicationsCsv(req, res) {
  try {
    const applications = await applicationModel.getAllApplications()

    const fields = [
      { label: 'ID Prijave', value: 'id' },
      { label: 'ID Radionice', value: 'workshop_id' },
      { label: 'Naziv Radionice', value: 'workshop_name' },
      { label: 'Ime', value: 'first_name' },
      { label: 'Prezime', value: 'last_name' },
      { label: 'Email', value: 'email' },
      { label: 'Telefon', value: 'phone' },
      { label: 'Datum rođenja', value: 'date_of_birth' },
      { label: 'Fakultet/Škola', value: 'faculty_school' },
      { label: 'Dodatni tekst', value: 'additional_text' },
      { label: 'Kanal prijave', value: 'source_channel' },
      { label: 'Datum prijave', value: 'applied_at' },
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(applications)

    res.header('Content-Type', 'text/csv')
    res.attachment('gthub_applications.csv')
    res.send(csv)
  } catch (error) {
    console.error('Greška pri exportu prijava u CSV:', error.message)
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri exportu prijava.' })
  }
}

module.exports = {
  getApplications,
  getApplication,
  addApplication,
  deleteApplication,
  exportApplicationsCsv,
}
