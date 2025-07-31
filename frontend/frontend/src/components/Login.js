// frontend/src/components/Login.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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

      // KLJUČNO: Postavite Axios default header odmah nakon prijave
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
      <h2>Prijava</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Korisničko ime:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Lozinka:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Prijavi se</button>
      </form>
    </div>
  )
}

export default Login
