import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Form from '../components/Form/Form'
import styles from '../styles/login.module.css'
import '../styles/message.css'

function Login({ setAuthToken }) {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loginFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Example',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'aQ98?rqA291%hkd',
      required: true,
    },
  ]

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        formData
      )
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
    <div className={styles.loginContainer}>
      <Form
        fields={loginFields}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        title="Log in"
        submitButtonText="Log in"
      />
      {error && <ErrorMessage message={error} type="error" />}
    </div>
  )
}

export default Login
