import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/application.css'

function Applications({ authToken }) {
  const [workshops, setWorkshops] = useState([])
  const [selectedWorkshopId, setSelectedWorkshopId] = useState('')
  const [applications, setApplications] = useState([])
  const [loadingWorkshops, setLoadingWorkshops] = useState(true)
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [error, setError] = useState(null)

  const channelMap = {
    0: 'Facebook',
    1: 'Instagram',
    2: 'LinkedIn',
    3: 'Drugo',
  }

  const fetchWorkshops = async () => {
    try {
      setLoadingWorkshops(true)
      const response = await axios.get('/api/workshops')
      setWorkshops(response.data)
      if (response.data.length > 0) {
        setSelectedWorkshopId(response.data[0].id)
      }
      setError(null)
    } catch (err) {
      console.error('Greška pri dohvatanju radionica za prijave:', err)
      setError('Došlo je do greške prilikom učitavanja liste radionica.')
    } finally {
      setLoadingWorkshops(false)
    }
  }

  const fetchApplications = async () => {
    if (!selectedWorkshopId) {
      setApplications([])
      return
    }
    try {
      setLoadingApplications(true)
      const response = await axios.get(
        `/api/applications/workshop/${selectedWorkshopId}`
      )
      setApplications(response.data)
      setError(null)
    } catch (err) {
      console.error('Greška pri dohvatanju prijava:', err)
      setError('Došlo je do greške prilikom učitavanja prijava za radionicu.')
      setApplications([])
    } finally {
      setLoadingApplications(false)
    }
  }

  useEffect(() => {
    fetchWorkshops()
  }, [authToken])

  useEffect(() => {
    fetchApplications()
  }, [selectedWorkshopId, authToken])

  if (loadingWorkshops) return <p>Učitavanje radionica za odabir...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="applications-container">
      <h2>Prijave na Radionice</h2>

      <div className="form-group">
        <label htmlFor="workshopSelect">Odaberite Radionicu:</label>
        <select
          id="workshopSelect"
          value={selectedWorkshopId}
          onChange={(e) => setSelectedWorkshopId(e.target.value)}
          disabled={workshops.length === 0}
        >
          {workshops.length === 0 ? (
            <option value="">Nema dostupnih radionica</option>
          ) : (
            workshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.name}
              </option>
            ))
          )}
        </select>
      </div>

      <h3>
        Prijave za{' '}
        {workshops.find((w) => w.id === parseInt(selectedWorkshopId))?.name ||
          'odabranu radionicu'}
      </h3>

      {loadingApplications ? (
        <p>Učitavanje prijava...</p>
      ) : applications.length === 0 ? (
        <p>Nema prijava za ovu radionicu.</p>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Ime i prezime</th>
              <th>E-mail</th>
              <th>Telefon</th>
              <th>Datum rođenja</th>
              <th>Fakultet / škola</th>
              <th>Dodatno polje</th>
              <th>Kanal saznanja</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.first_name + ' ' + app.last_name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{new Date(app.dateOfBirth).toLocaleDateString()}</td>
                <td>{app.faculty_school}</td>
                <td>{app.additional_text}</td>
                <td>{channelMap[app.source_channel]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Applications
