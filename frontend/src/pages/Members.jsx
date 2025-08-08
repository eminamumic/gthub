import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import '../styles/members.css'
import '../styles/message.css'
import Button from '../components/Button/Button'

function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterExpiring, setFilterExpiring] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/members', {
        params: {
          search: searchTerm,
          expiringSoon: filterExpiring,
        },
      })
      setMembers(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching members.')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterExpiring])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const validateForm = (data) => {
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
      new Date(data.membership_start_date) >
        new Date(data.membership_expiry_date)
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

  const handleAddEditSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm(currentMember)) return

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

  const handleDelete = async (id) => {
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

  const openAddModal = () => {
    setCurrentMember({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      email: '',
      phone: '',
      faculty: '',
      membership_start_date: '',
      membership_expiry_date: '',
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (member) => {
    setCurrentMember({
      ...member,
      date_of_birth: member.date_of_birth
        ? new Date(member.date_of_birth).toISOString().split('T')[0]
        : '',
      membership_start_date: member.membership_start_date
        ? new Date(member.membership_start_date).toISOString().split('T')[0]
        : '',
      membership_expiry_date: member.membership_expiry_date
        ? new Date(member.membership_expiry_date).toISOString().split('T')[0]
        : '',
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleExport = async () => {
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

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('hr-HR')
  }

  if (loading) return <p className="loading-message">Loading members...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="members-container">
      <h2>Member Management</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, last name, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filterExpiring}
            onChange={(e) => setFilterExpiring(e.target.checked)}
          />
          Membership expiring (30 days)
        </label>
        <Button onClick={openAddModal} variant="add" text="Add New Member" />

        <Button onClick={handleExport} variant="export" text="Export to CSV" />
      </div>

      {members.length === 0 ? (
        <p className="message-container error">No members found.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Faculty</th>
                <th>Date of Birth</th>
                <th>Membership From</th>
                <th>Membership Until</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.first_name}</td>
                  <td>{member.last_name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone || 'N/A'}</td>
                  <td>{member.faculty || 'N/A'}</td>
                  <td>{formatDate(member.date_of_birth)}</td>
                  <td>{formatDate(member.membership_start_date)}</td>
                  <td>{formatDate(member.membership_expiry_date)}</td>
                  <td className="actions-column">
                    <Button
                      onClick={() => openEditModal(member)}
                      variant="edit"
                      text="Edit"
                    />

                    <Button
                      onClick={() => handleDelete(member.id)}
                      variant="delete"
                      text="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentMember.id ? 'Edit Member' : 'Add New Member'}</h3>
            <form onSubmit={handleAddEditSubmit}>
              <div className="form-group modal">
                <label htmlFor="first_name">First Name:</label>
                <input
                  type="text"
                  id="first_name"
                  value={currentMember.first_name}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      first_name: e.target.value,
                    })
                  }
                />
                {formErrors.first_name && (
                  <span className="message-container error">
                    {formErrors.first_name}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name:</label>
                <input
                  type="text"
                  id="last_name"
                  value={currentMember.last_name}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      last_name: e.target.value,
                    })
                  }
                />
                {formErrors.last_name && (
                  <span className="message-container error">
                    {formErrors.last_name}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={currentMember.email}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      email: e.target.value,
                    })
                  }
                />
                {formErrors.email && (
                  <span className="message-container error">
                    {formErrors.email}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  value={currentMember.phone}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="faculty">Faculty:</label>
                <input
                  type="text"
                  id="faculty"
                  value={currentMember.faculty}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      faculty: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="date_of_birth">Date of Birth:</label>
                <input
                  type="date"
                  id="date_of_birth"
                  value={currentMember.date_of_birth}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      date_of_birth: e.target.value,
                    })
                  }
                />
                {formErrors.date_of_birth && (
                  <span className="message-container error">
                    {formErrors.date_of_birth}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="membership_start_date">Membership From:</label>
                <input
                  type="date"
                  id="membership_start_date"
                  value={currentMember.membership_start_date}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      membership_start_date: e.target.value,
                    })
                  }
                />
                {formErrors.membership_start_date && (
                  <span className="message-container error">
                    {formErrors.membership_start_date}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="membership_expiry_date">
                  Membership Until:
                </label>
                <input
                  type="date"
                  id="membership_expiry_date"
                  value={currentMember.membership_expiry_date}
                  onChange={(e) =>
                    setCurrentMember({
                      ...currentMember,
                      membership_expiry_date: e.target.value,
                    })
                  }
                />
                {formErrors.membership_expiry_date && (
                  <span className="message-container error">
                    {formErrors.membership_expiry_date}
                  </span>
                )}
              </div>
              <div className="modal-actions">
                <Button
                  variant="add"
                  text={currentMember.id ? 'Update' : 'Add'}
                />

                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="cancel"
                  text="Cancel"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members
