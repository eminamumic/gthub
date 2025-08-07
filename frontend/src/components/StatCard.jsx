import React from 'react'
import '../styles/statcard.css'

const StatCard = ({ value, title }) => {
  return (
    <div class="stat-card">
      <div class="value">{value}</div>
      <div class="title">{title}</div>
    </div>
  )
}

export default StatCard
