import React from 'react'
import '../styles/ErrorMessage.css'

const ErrorMessage = ({ message, type = 'error' }) => {
  if (!message) {
    return null
  }

  const className = `message-container ${type}`

  return (
    <div className={className}>
      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage
