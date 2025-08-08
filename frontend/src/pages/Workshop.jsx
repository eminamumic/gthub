import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/workshop.css'
import Button from '../components/Button/Button'
import Header from '../components/Header/Header'

function Workshops({ authToken }) {
  const [workshops, setWorkshops] = useState([])
  const [newWorkshopName, setNewWorkshopName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/workshops')
      setWorkshops(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching workshops:', err)
      setError('An error occurred while loading workshops.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkshops()
  }, [authToken])

  const handleAddWorkshop = async (e) => {
    e.preventDefault()
    if (!newWorkshopName.trim()) {
      setError('Workshop name cannot be empty.')
      return
    }
    try {
      const response = await axios.post('/api/workshops', {
        name: newWorkshopName,
      })
      setWorkshops([...workshops, response.data])
      setNewWorkshopName('')
      setError(null)
    } catch (err) {
      console.error('Error adding workshop:', err)
      setError('An error occurred while adding the workshop.')
    }
  }

  if (loading) return <p>Loading workshops...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="workshops-container">
      <Header title="Workshop Management" variant="primary"></Header>

      <form onSubmit={handleAddWorkshop} className="add-workshop-form">
        <div className="form-group">
          <label htmlFor="newWorkshopName" className="label-add-workshop">
            New workshop name:
          </label>
          <input
            type="text"
            id="newWorkshopName"
            value={newWorkshopName}
            onChange={(e) => setNewWorkshopName(e.target.value)}
            required
          />
        </div>
        <Button text="Add Workshop" variant="primary" />
      </form>

      <Header title="Workshop List" variant="secondary"></Header>
      {workshops.length === 0 ? (
        <p>No workshops added yet.</p>
      ) : (
        <table className="workshops-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Workshop Name</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map((workshop) => (
              <tr key={workshop.id}>
                <td>{workshop.id}</td>
                <td>{workshop.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Workshops
