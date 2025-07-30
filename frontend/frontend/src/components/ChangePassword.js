import React, { useState } from 'react'
import axios from 'axios'

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPassword.length < 6) {
      setError('Nova lozinka mora imati najmanje 6 znakova.')
      return
    }

    try {
      const response = await axios.post('/api/auth/change-password', {
        oldPassword,
        newPassword,
      })
      setMessage(response.data.message)
      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Greška prilikom promjene lozinke.'
      )
    }
  }

  return (
    <div className="change-password-container">
      <h2>Promjena lozinke</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Stara lozinka:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nova lozinka:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Promijeni lozinku</button>
      </form>
    </div>
  )
}

export default ChangePassword
