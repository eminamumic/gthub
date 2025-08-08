import React from 'react'
import styles from './Button.module.css'

const Button = ({
  text,
  onClick,
  type = 'button',
  variant = '',
  variant_2 = '',
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[`btn-${variant}`]} ${
        styles[`${variant_2}`]
      }  `}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  )
}

export default Button
