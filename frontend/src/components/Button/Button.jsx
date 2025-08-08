import React from 'react'
import styles from './Button.module.css'

const Button = ({ text, onClick, type = 'button', variant = 'primary' }) => {
  return (
    <button
      className={`${styles.btn} ${styles[`btn-${variant}`]}`}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  )
}

export default Button
