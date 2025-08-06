import React from 'react'
import '../styles/statcard'

const StatCard = ({ value, title }) => {
  return (
    <div className="stat-card">
      <p>{value}</p>
      <p>{title}</p>
    </div>
  )
}

export default StatCard
