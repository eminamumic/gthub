const memberModel = require('../models/memberModel')
const { Parser } = require('json2csv')

const isValidDate = (dateString) => {
  return dateString && !isNaN(new Date(dateString).getTime())
}

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function getMembers(req, res) {
  try {
    const members = await memberModel.getAllMembers()
    res.status(200).json(members)
  } catch (error) {
    console.error('Greška pri dohvaćanju članova (kontroler):', error.message)
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dohvaćanju članova.' })
  }
}

async function getMember(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID člana mora biti numerički.' })
  }

  try {
    const member = await memberModel.getMemberById(id)
    if (!member) {
      return res.status(404).json({ message: 'Član nije pronađen.' })
    }
    res.status(200).json(member)
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju člana po ID-u (kontroler):',
      error.message
    )
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dohvaćanju člana.' })
  }
}

async function addMember(req, res) {
  const {
    first_name,
    last_name,
    date_of_birth,
    email,
    phone,
    faculty,
    membership_start_date,
    membership_expiry_date,
  } = req.body

  if (
    !first_name ||
    !last_name ||
    !date_of_birth ||
    !email ||
    !membership_start_date
  ) {
    return res.status(400).json({
      message:
        'Ime, prezime, datum rođenja, email i datum početka članarine su obavezni.',
    })
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: 'Unesite ispravan format email adrese.' })
  }
  if (!isValidDate(date_of_birth) || !isValidDate(membership_start_date)) {
    return res.status(400).json({
      message:
        'Datum rođenja i datum početka članarine moraju biti validni datumi (YYYY-MM-DD).',
    })
  }
  if (membership_expiry_date && !isValidDate(membership_expiry_date)) {
    return res.status(400).json({
      message: 'Datum isteka članarine mora biti validan datum (YYYY-MM-DD).',
    })
  }

  const memberData = {
    first_name,
    last_name,
    date_of_birth,
    email,
    phone: phone || null,
    faculty: faculty || null,
    membership_start_date,
    membership_expiry_date: membership_expiry_date || null,
  }

  try {
    const newMember = await memberModel.addMember(memberData)
    res.status(201).json({ message: 'Član uspješno dodan!', member: newMember })
  } catch (error) {
    console.error('Greška pri dodavanju člana (kontroler):', error.message)
    if (error.message.includes('Član sa ovim emailom već postoji.')) {
      return res
        .status(409)
        .json({ message: 'Član sa unesenim emailom već postoji.' })
    }
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dodavanju člana.' })
  }
}

async function updateMember(req, res) {
  const { id } = req.params
  const updateData = req.body

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID člana mora biti numerički.' })
  }
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: 'Nema podataka za ažuriranje.' })
  }

  if (updateData.email && !isValidEmail(updateData.email)) {
    return res
      .status(400)
      .json({ message: 'Unesite ispravan format email adrese.' })
  }
  if (updateData.date_of_birth && !isValidDate(updateData.date_of_birth)) {
    return res
      .status(400)
      .json({ message: 'Datum rođenja mora biti validan datum (YYYY-MM-DD).' })
  }
  if (
    updateData.membership_start_date &&
    !isValidDate(updateData.membership_start_date)
  ) {
    return res.status(400).json({
      message: 'Datum početka članarine mora biti validan datum (YYYY-MM-DD).',
    })
  }
  if (
    updateData.membership_expiry_date &&
    !isValidDate(updateData.membership_expiry_date)
  ) {
    return res.status(400).json({
      message: 'Datum isteka članarine mora biti validan datum (YYYY-MM-DD).',
    })
  }

  try {
    const success = await memberModel.updateMember(id, updateData)
    if (!success) {
      return res
        .status(404)
        .json({ message: 'Član nije pronađen ili nema promjena.' })
    }
    res.status(200).json({ message: 'Član uspješno ažuriran!' })
  } catch (error) {
    console.error('Greška pri ažuriranju člana (kontroler):', error.message)
    if (error.message.includes('Email već postoji kod drugog člana.')) {
      return res
        .status(409)
        .json({ message: 'Email već pripada drugom članu.' })
    }
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri ažuriranju člana.' })
  }
}

async function deleteMember(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID člana mora biti numerički.' })
  }

  try {
    const success = await memberModel.deleteMember(id)
    if (!success) {
      return res.status(404).json({ message: 'Član nije pronađen.' })
    }
    res.status(200).json({ message: 'Član uspješno obrisan.' })
  } catch (error) {
    console.error('Greška pri brisanju člana (kontroler):', error.message)
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri brisanju člana.' })
  }
}

async function exportMembersCsv(req, res) {
  try {
    const members = await memberModel.getAllMembers()

    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Ime', value: 'first_name' },
      { label: 'Prezime', value: 'last_name' },
      { label: 'Datum rođenja', value: 'date_of_birth' },
      { label: 'Email', value: 'email' },
      { label: 'Telefon', value: 'phone' },
      { label: 'Fakultet', value: 'faculty' },
      { label: 'Datum početka članarine', value: 'membership_start_date' },
      { label: 'Datum isteka članarine', value: 'membership_expiry_date' },
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(members)

    res.header('Content-Type', 'text/csv')
    res.attachment('gthub_members.csv')
    res.send(csv)
  } catch (error) {
    console.error('Greška pri exportu članova u CSV:', error.message)
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri exportu članova.' })
  }
}

module.exports = {
  getMembers,
  getMember,
  addMember,
  updateMember,
  deleteMember,
  exportMembersCsv,
}
