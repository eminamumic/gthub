import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'
import Button from '../components/Button'

function Login({ setAuthToken }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
            <input
              type="password"
              id="password"
              value={password}
              placeholder="aQ98?rqA291%hkd"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <Button type="submit">Log in</Button>
      </form>
    </div>
  )
}

export default Login
