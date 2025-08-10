import React from 'react'
import styles from './ListCard.module.css'
import Header from '../Header/Header'

const ListCard = ({ title, items }) => {
  return (
    <div className={styles.listCard}>
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
