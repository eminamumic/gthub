const memberModel = require('../models/memberModel')
const { Parser } = require('json2csv')

const isValidDate = (dateString) => {
  return dateString && !isNaN(new Date(dateString).getTime())
}

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function getMembers(req, res) {
  const { search, expiringSoon } = req.query

  const options = {
    search: search || null,
    expiringSoon: expiringSoon === 'true',
  }

  try {
    const members = await memberModel.getAllMembers(options)
    res.status(200).json(members)
  } catch (error) {
    console.error(
      'Error fetching members (controller, with filters):',
      error.message
    )
    res.status(500).json({ message: 'Internal server error fetching members.' })
  }
}

async function getMember(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Member ID must be a number.' })
  }

  try {
    const member = await memberModel.getMemberById(id)
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' })
    }
    res.status(200).json(member)
  } catch (error) {
    console.error('Error fetching member by ID (controller):', error.message)
    res.status(500).json({ message: 'Internal server error fetching member.' })
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
        'First name, last name, date of birth, email, and membership start date are required.',
    })
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address format.' })
  }
  if (!isValidDate(date_of_birth) || !isValidDate(membership_start_date)) {
    return res.status(400).json({
      message:
        'Date of birth and membership start date must be valid dates (YYYY-MM-DD).',
    })
  }
  if (membership_expiry_date && !isValidDate(membership_expiry_date)) {
    return res.status(400).json({
      message: 'Membership expiry date must be a valid date (YYYY-MM-DD).',
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
    res
      .status(201)
      .json({ message: 'Member successfully added!', member: newMember })
  } catch (error) {
    console.error('Error adding member (controller):', error.message)
    if (error.message.includes('A member with this email already exists.')) {
      return res
        .status(409)
        .json({ message: 'A member with the entered email already exists.' })
    }
    res.status(500).json({ message: 'Internal server error adding member.' })
  }
}

async function updateMember(req, res) {
  const { id } = req.params
  const updateData = req.body

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Member ID must be a number.' })
  }
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: 'No data provided for update.' })
  }

  if (updateData.email && !isValidEmail(updateData.email)) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address format.' })
  }
  if (updateData.date_of_birth && !isValidDate(updateData.date_of_birth)) {
    return res
      .status(400)
      .json({ message: 'Date of birth must be a valid date (YYYY-MM-DD).' })
  }
  if (
    updateData.membership_start_date &&
    !isValidDate(updateData.membership_start_date)
  ) {
    return res.status(400).json({
      message: 'Membership start date must be a valid date (YYYY-MM-DD).',
    })
  }
  if (
    updateData.membership_expiry_date &&
    !isValidDate(updateData.membership_expiry_date)
  ) {
    return res.status(400).json({
      message: 'Membership expiry date must be a valid date (YYYY-MM-DD).',
    })
  }

  try {
    const success = await memberModel.updateMember(id, updateData)
    if (!success) {
      return res
        .status(404)
        .json({ message: 'Member not found or no changes were made.' })
    }
    res.status(200).json({ message: 'Member successfully updated!' })
  } catch (error) {
    console.error('Error updating member (controller):', error.message)
    if (error.message.includes('Email already exists for another member.')) {
      return res
        .status(409)
        .json({ message: 'Email already belongs to another member.' })
    }
    res.status(500).json({ message: 'Internal server error updating member.' })
  }
}

async function deleteMember(req, res) {
  const { id } = req.params
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Member ID must be a number.' })
  }

  try {
    const success = await memberModel.deleteMember(id)
    if (!success) {
      return res.status(404).json({ message: 'Member not found.' })
    }
    res.status(200).json({ message: 'Member successfully deleted.' })
  } catch (error) {
    console.error('Error deleting member (controller):', error.message)
    res.status(500).json({ message: 'Internal server error deleting member.' })
  }
}

async function exportMembersCsv(req, res) {
  try {
    const members = await memberModel.getAllMembers()

    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'First Name', value: 'first_name' },
      { label: 'Last Name', value: 'last_name' },
      { label: 'Date of Birth', value: 'date_of_birth' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Faculty', value: 'faculty' },
      { label: 'Membership Start Date', value: 'membership_start_date' },
      { label: 'Membership Expiry Date', value: 'membership_expiry_date' },
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(members)

    res.header('Content-Type', 'text/csv')
    res.attachment('gthub_members.csv')
    res.send(csv)
  } catch (error) {
    console.error('Error exporting members to CSV:', error.message)
    res
      .status(500)
      .json({ message: 'Internal server error exporting members.' })
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
