import React, { useEffect, useState } from 'react'
import axios from 'axios'
import StatCard from '../components/StatCard/StatCard'
import ListCard from '../components/ListCard'
import ErrorMessage from '../components/ErrorMessage'
import Header from '../components/Header/Header'
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
        setError(err.response?.data?.message || 'Failed to fetch statistics.')
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <p className="loading-message">Loading statistics...</p>
  if (error) return <ErrorMessage message={error} type="error" />

  return (
    <div className="dashboard-container">
      <Header title="Dashboard"></Header>
      {stats ? (
        <div className="stats-grid">
          <StatCard title="Total Members" value={stats.totalMembers} />
          <StatCard
            title="Memberships Expiring"
            value={stats.expiringMembers}
          />
          <StatCard title="Total Workshops" value={stats.totalWorkshops} />
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
          />

          <div className="full-width">
            <ListCard
              title="Applications by Workshop"
              items={stats.applicationsByWorkshop}
            />
          </div>
          <div className="full-width">
            <ListCard
              title="Applications by Channel"
              items={stats.applicationsBySourceChannel}
            />
          </div>
        </div>
      ) : (
        <p>No statistics available.</p>
      )}
    </div>
  )
}

export default Dashboard
