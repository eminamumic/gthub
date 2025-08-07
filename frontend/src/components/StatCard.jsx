import React from 'react'
import '../styles/statcard.css'

const StatCard = ({ value, title }) => {
  return (
    <div className="stat-card">
      <div className="value">{value}</div>
      <div className="title">{title}</div>
    </div>
  )
}

export default StatCard
