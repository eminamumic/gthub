import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button/Button'
import ErrorMessage from '../components/ErrorMessage'
import '../styles/login.css'

import '../styles/message.css'

function Login({ setAuthToken }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      })

      const { token } = response.data

      localStorage.setItem('jwtToken', token)

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setAuthToken(token)

      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Greška prilikom prijave. Pokušajte ponovo.'
      )
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Log in</h2>
        <div className="form-group">
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Example"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                placeholder="aQ98?rqA291%hkd"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>
        {error && <ErrorMessage message={error} type="error" />}
        <Button type="submit" text="Log in" variant="primary"></Button>
      </form>
    </div>
  )
}

export default Login
