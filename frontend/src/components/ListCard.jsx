import React from 'react'
import '../styles/listcard.css'
import Header from './Header/Header'

const ListCard = ({ title, items }) => {
  return (
    <div className="list-card">
      <Header title={title} variant="secondary"></Header>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{Object.values(item).join(': ')}</li>
        ))}
      </ul>
    </div>
  )
}

export default ListCard
