import axios from 'axios'

export const validateForm = (data, setFormErrors) => {
  const errors = {}
  if (!data.first_name.trim()) errors.first_name = 'First name is required.'
  if (!data.last_name.trim()) errors.last_name = 'Last name is required.'
  if (!data.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email format.'
  }
  if (!data.membership_start_date)
    errors.membership_start_date = 'Membership start date is required.'
  if (!data.membership_expiry_date)
    errors.membership_expiry_date = 'Membership expiry date is required.'

  if (
    data.membership_start_date &&
    data.membership_expiry_date &&
    new Date(data.membership_start_date) > new Date(data.membership_expiry_date)
  ) {
    errors.membership_expiry_date =
      'Expiry date cannot be before the start date.'
  }
  if (data.date_of_birth && new Date(data.date_of_birth) > new Date()) {
    errors.date_of_birth = 'Date of birth cannot be in the future.'
  }

  setFormErrors(errors)
  return Object.keys(errors).length === 0
}

export const handleAddEditSubmit = async (
  e,
  currentMember,
  validateForm,
  fetchMembers,
  setIsModalOpen,
  setFormErrors,
  setError
) => {
  e.preventDefault()

  if (!validateForm(currentMember, setFormErrors)) return

  try {
    if (currentMember.id) {
      await axios.put(`/api/members/${currentMember.id}`, currentMember)
      alert('Member updated successfully!')
    } else {
      await axios.post('/api/members', currentMember)
      alert('Member added successfully!')
    }
    setIsModalOpen(false)
    fetchMembers()
  } catch (err) {
    setError(err.response?.data?.message || 'Error saving member.')
  }
}

export const handleDelete = async (id, fetchMembers, setError) => {
  if (window.confirm('Are you sure you want to delete this member?')) {
    try {
      await axios.delete(`/api/members/${id}`)
      alert('Member deleted successfully!')
      fetchMembers()
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting member.')
    }
  }
}

export const handleExport = async (setError) => {
  try {
    const response = await axios.get('/api/members/export', {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'gthub_members.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    setError('Error exporting members to CSV.')
  }
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('hr-HR')
}
