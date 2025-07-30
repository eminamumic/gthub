import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import axios from 'axios'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ChangePassword from './components/ChangePassword'
import './App.css'

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken'))

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [authToken])

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    setAuthToken(null)
  }

  return (
    <Router>
      <div className="App">
        {authToken && (
          <nav className="main-nav">
            <button onClick={() => (window.location.href = '/dashboard')}>
              Dashboard
            </button>
            <button onClick={() => (window.location.href = '/change-password')}>
              Promijeni lozinku
            </button>
            <button onClick={handleLogout}>Odjavi se</button>
          </nav>
        )}

        <Routes>
          <Route
            path="/login"
            element={
              authToken ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login setAuthToken={setAuthToken} />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              authToken ? (
                <Dashboard authToken={authToken} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/change-password"
            element={
              authToken ? (
                <ChangePassword authToken={authToken} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="*"
            element={
              authToken ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
