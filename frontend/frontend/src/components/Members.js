import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import '../styles/members.css'

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
      setError(err.response?.data?.message || 'Greška pri dohvaćanju članova.')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterExpiring])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const validateForm = (data) => {
    const errors = {}
    if (!data.first_name.trim()) errors.first_name = 'Ime je obavezno.'
    if (!data.last_name.trim()) errors.last_name = 'Prezime je obavezno.'
    if (!data.email.trim()) {
      errors.email = 'Email je obavezan.'
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Nevažeći format emaila.'
    }
    if (!data.membership_start_date)
      errors.membership_start_date = 'Datum početka članarine je obavezan.'
    if (!data.membership_expiry_date)
      errors.membership_expiry_date = 'Datum isteka članarine je obavezan.'

    if (
      data.membership_start_date &&
      data.membership_expiry_date &&
      new Date(data.membership_start_date) >
        new Date(data.membership_expiry_date)
    ) {
      errors.membership_expiry_date =
        'Datum isteka ne može biti prije datuma početka.'
    }
    if (data.date_of_birth && new Date(data.date_of_birth) > new Date()) {
      errors.date_of_birth = 'Datum rođenja ne može biti u budućnosti.'
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
        alert('Član uspješno ažuriran!')
      } else {
        await axios.post('/api/members', currentMember)
        alert('Član uspješno dodan!')
      }
      setIsModalOpen(false)
      fetchMembers()
    } catch (err) {
      setError(
        err.response?.data?.message || 'Greška prilikom spremanja člana.'
      )
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovog člana?')) {
      try {
        await axios.delete(`/api/members/${id}`)
        alert('Član uspješno obrisan!')
        fetchMembers()
      } catch (err) {
        setError(err.response?.data?.message || 'Greška pri brisanju člana.')
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
      setError('Greška pri exportu članova u CSV.')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('hr-HR')
  }

  if (loading) return <p className="loading-message">Učitavanje članova...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    // Dodan je div s klasom "members-container"
    <div className="members-container">
      <h2>Upravljanje članovima</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Pretraži po imenu, prezimenu, emailu..."
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
          Ističe članarina (30 dana)
        </label>
        <button onClick={openAddModal} className="btn btn-add">
          Dodaj novog člana
        </button>
        <button onClick={handleExport} className="btn btn-export">
          Export u CSV
        </button>
      </div>

      {members.length === 0 ? (
        <p>Nema pronađenih članova.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ime</th>
                <th>Prezime</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Fakultet</th>
                <th>Datum rođenja</th>
                <th>Članarina od</th>
                <th>Članarina do</th>
                <th>Akcije</th>
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
                    <button
                      onClick={() => openEditModal(member)}
                      className="btn btn-edit"
                    >
                      Uredi
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="btn btn-delete"
                    >
                      Obriši
                    </button>
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
            <h3>{currentMember.id ? 'Uredi člana' : 'Dodaj novog člana'}</h3>
            <form onSubmit={handleAddEditSubmit}>
              <div className="form-group">
                <label htmlFor="first_name">Ime:</label>
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
                  <span className="error-message">{formErrors.first_name}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Prezime:</label>
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
                  <span className="error-message">{formErrors.last_name}</span>
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
                  <span className="error-message">{formErrors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefon:</label>
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
                <label htmlFor="faculty">Fakultet:</label>
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
                <label htmlFor="date_of_birth">Datum rođenja:</label>
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
                  <span className="error-message">
                    {formErrors.date_of_birth}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="membership_start_date">Članarina od:</label>
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
                  <span className="error-message">
                    {formErrors.membership_start_date}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="membership_expiry_date">Članarina do:</label>
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
                  <span className="error-message">
                    {formErrors.membership_expiry_date}
                  </span>
                )}
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-add">
                  {currentMember.id ? 'Ažuriraj' : 'Dodaj'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-cancel"
                >
                  Odustani
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members
