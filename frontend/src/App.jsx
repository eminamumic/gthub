import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import axios from 'axios'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Members from './pages/Members'
import Workshops from './pages/Workshop'
import Applications from './pages/Application'
import ChangePassword from './pages/ChangePassword'

import './styles/navbar.css'

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken'))
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [authToken])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    setAuthToken(null)
    navigate('/login')
  }

  return (
    <div className="App">
      {authToken ? (
        <>
          <nav className={`main-nav ${isScrolled ? 'scrolled' : ''}`}>
            <button onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button onClick={() => navigate('/members')}>Članovi</button>
            <button onClick={() => navigate('/workshops')}>Radionice</button>
            <button onClick={() => navigate('/applications')}>Prijave</button>
            <button onClick={() => navigate('/change-password')}>
              Promijeni lozinku
            </button>
            <button onClick={handleLogout}>Odjavi se</button>
          </nav>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Login setAuthToken={setAuthToken} />} />
        </Routes>
      )}
    </div>
  )
}

export default App
