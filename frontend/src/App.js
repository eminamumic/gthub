// frontend/src/App.js
import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ChangePassword from './pages/ChangePassword'
import Members from './pages/Members'
// DODAJTE NOVE IMPORTE ZA KOMPONENTE RADIONICA I PRIJAVA
import Workshops from './pages/Workshop'
import Applications from './pages/Application' // Nova komponenta za prijave

import './App.css'

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken'))
  const navigate = useNavigate()

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
    navigate('/login')
  }

  return (
    <div className="App">
      {authToken && (
        <nav className="main-nav">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/members')}>Članovi</button>
          {/* NOVI DUGMIĆI ZA NAVIGACIJU */}
          <button onClick={() => navigate('/workshops')}>Radionice</button>
          <button onClick={() => navigate('/applications')}>Prijave</button>
          {/* KRAJ NOVIH DUGMIĆA */}
          <button onClick={() => navigate('/change-password')}>
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
          path="/members"
          element={
            authToken ? (
              <Members authToken={authToken} />
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

        {/* NOVE RUTE ZA RADIONICE I PRIJAVE */}
        <Route
          path="/workshops"
          element={
            authToken ? (
              <Workshops authToken={authToken} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/applications"
          element={
            authToken ? (
              <Applications authToken={authToken} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* KRAJ NOVIH RUTA */}

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
  )
}

export default App
