import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/dashboard.css'
import StatCard from '../components/StatCard'
import ListCard from '../components/ListCard'
import ErrorMessage from '../components/ErrorMessage' // Pretpostavljam da imaš ovu komponentu

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

  if (loading)
    return <p className="loading-message">Učitavanje statistike...</p>
  if (error) return <ErrorMessage message={error} type="error" />

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {stats ? (
        <div className="stats-grid">
          <StatCard title="Ukupno članova" value={stats.totalMembers} />
          <StatCard title="Istek članarine" value={stats.expiringMembers} />
          <StatCard title="Ukupno radionica" value={stats.totalWorkshops} />
          <StatCard title="Ukupno prijava" value={stats.totalApplications} />

          <div className="full-width">
            <ListCard
              title="Prijave po radionici"
              items={stats.applicationsByWorkshop}
            />
          </div>
          <div className="full-width">
            <ListCard
              title="Prijave po kanalu"
              items={stats.applicationsBySourceChannel}
            />
          </div>
        </div>
      ) : (
        <p>Nema dostupnih statistika.</p>
      )}
    </div>
  )
}

export default Dashboard
