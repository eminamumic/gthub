import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats/dashboard')
        setStats(response.data)
        setLoading(false)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Neuspješno dohvaćanje statistike.'
        )
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <p>Učitavanje statistike...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Ukupno članova</h3>
            <p>{stats.totalMembers}</p>
          </div>
          <div className="stat-card">
            <h3>Članovi kojima ističe članarina (30 dana)</h3>
            <p>{stats.expiringMembers}</p>
          </div>
          <div className="stat-card">
            <h3>Ukupno radionica</h3>
            <p>{stats.totalWorkshops}</p>
          </div>
          <div className="stat-card">
            <h3>Ukupno prijava</h3>
            <p>{stats.totalApplications}</p>
          </div>

          <div className="stat-card full-width">
            <h3>Prijave po radionici</h3>
            <ul>
              {stats.applicationsByWorkshop.map((item, index) => (
                <li key={index}>
                  {item.workshop_name}: {item.application_count}
                </li>
              ))}
            </ul>
          </div>
          <div className="stat-card full-width">
            <h3>Prijave po kanalu</h3>
            <ul>
              {stats.applicationsBySourceChannel.map((item, index) => (
                <li key={index}>
                  {item.source_channel}: {item.total}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Nema dostupnih statistika.</p>
      )}
    </div>
  )
}

export default Dashboard
