import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import axios from 'axios'

import Navbar from './components/Navbar/Navbar'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Members from './pages/Members'
import Workshops from './pages/Workshop'
import Applications from './pages/Application'
import ChangePassword from './pages/ChangePassword'

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

  useEffect(() => {
    if (!authToken) {
      navigate('/login')
    }
  }, [authToken, navigate])

  return (
    <div className="App">
      {authToken ? (
        <>
          <Navbar setAuthToken={setAuthToken} />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Dashboard />} />
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
