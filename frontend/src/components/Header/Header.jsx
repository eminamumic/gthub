import React from 'react'
import styles from './Header.module.css'

export default function Header({ title, variant = 'primary' }) {
  return (
    <h3 className={`${styles.header} ${styles[`header-${variant}`]}`}>
      {title}
    </h3>
  )
}
