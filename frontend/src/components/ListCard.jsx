import React from 'react'
import '../styles/listcard.css'

const ListCard = ({ title, items }) => {
  return (
    <div className="list-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{Object.values(item).join(': ')}</li>
        ))}
      </ul>
    </div>
  )
}

export default ListCard
