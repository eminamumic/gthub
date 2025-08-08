import React, { useState } from 'react'
import axios from 'axios'

import ErrorMessage from '../components/ErrorMessage'
import '../styles/login.css'
import Button from '../components/Button/Button'
import Header from '../components/Header/Header'

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.')
      return
    }

    try {
      const response = await axios.post('/api/auth/change-password', {
        oldPassword,
        newPassword,
        confirmNewPassword,
      })
      setMessage(response.data.message)
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password.')
    }
  }

  return (
    <div className="login-container password">
      <form onSubmit={handleSubmit}>
        <Header title="Change Password" variant="form"></Header>

        <div className="form-group">
          <div>
            <label htmlFor="oldPassword">Old password:</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword">New password:</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button
                text={showPassword ? '🙈' : '👁️'}
                onClick={togglePasswordVisibility}
                variant_2="password-toggle-btn"
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmNewPassword">Confirm new password:</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <Button
                text={showPassword ? '🙈' : '👁️'}
                onClick={togglePasswordVisibility}
                variant_2="password-toggle-btn"
              />
            </div>
          </div>
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <ErrorMessage message={error} type="error" />}
        <Button text="Change Password" variant="primary" />
      </form>
    </div>
  )
}

export default ChangePassword
