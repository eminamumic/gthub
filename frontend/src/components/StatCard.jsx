import React from 'react'
import '../styles/statcard.css'

const StatCard = ({ value, title }) => {
  return (
    <div className="stat-card">
      <p>{value}</p>
      <p>{title}</p>
    </div>
  )
}

export default StatCard
