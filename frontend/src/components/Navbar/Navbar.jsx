import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = ({ setAuthToken }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

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
    setIsMenuOpen(false)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  return (
    <nav className={`${styles.mainNav} ${isScrolled ? styles.scrolled : ''}`}>
      <button
        className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`}>
        <button onClick={() => handleNavigation('/dashboard')}>
          Dashboard
        </button>
        <button onClick={() => handleNavigation('/members')}>Members</button>
        <button onClick={() => handleNavigation('/workshops')}>
          Workshops
        </button>
        <button onClick={() => handleNavigation('/applications')}>
          Applications
        </button>
        <button onClick={() => handleNavigation('/change-password')}>
          Change Password
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar
