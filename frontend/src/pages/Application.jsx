import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/application.css'
import Header from '../components/Header/Header'

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
    3: 'Other',
  }

  const fetchWorkshops = async () => {
    try {
      setLoadingWorkshops(true)
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/workshops`
      )
      setWorkshops(response.data)
      if (response.data.length > 0) {
        setSelectedWorkshopId(response.data[0].id)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching workshops for applications:', err)
      setError('An error occurred while loading the list of workshops.')
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
        `${process.env.REACT_APP_API_URL}/applications/workshop/${selectedWorkshopId}`
      )
      setApplications(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching applications:', err)
      setError('An error occurred while loading applications for the workshop.')
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

  if (loadingWorkshops) return <p>Loading workshops...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="applications-container">
      <Header title="Workshop Applications"></Header>

      <div className="form-group">
        <label htmlFor="workshopSelect">Select Workshop:</label>
        <select
          id="workshopSelect"
          value={selectedWorkshopId}
          onChange={(e) => setSelectedWorkshopId(e.target.value)}
          disabled={workshops.length === 0}
        >
          {workshops.length === 0 ? (
            <option value="">No available workshops</option>
          ) : (
            workshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.name}
              </option>
            ))
          )}
        </select>
      </div>

      <Header
        title={`Applications for ${
          workshops.find((w) => w.id === parseInt(selectedWorkshopId))?.name ||
          'selected workshop'
        }`}
        variant="secondary"
      ></Header>

      {loadingApplications ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications for this workshop.</p>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>School / University</th>
              <th>Additional Field</th>
              <th>Referral Channel</th>
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
