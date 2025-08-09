import React from 'react'
import styles from './StatCard.module.css'

const StatCard = ({ value, title }) => {
  return (
    <div className={styles['stat-card']}>
      <p className={styles.value}>{value}</p>
      <p className={styles.title}>{title}</p>
    </div>
  )
}

export default StatCard
