// frontend/src/components/Workshops.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/workshop.css'

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
      console.error('Greška pri dohvatanju radionica:', err)
      setError('Došlo je do greške prilikom učitavanja radionica.')
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
      setError('Naziv radionice ne može biti prazan.')
      return
    }
    try {
      const response = await axios.post('/api/workshops', {
        name: newWorkshopName,
      })
      setWorkshops([...workshops, response.data]) // Dodajte novu radionicu u stanje
      setNewWorkshopName('') // Resetujte input polje
      setError(null)
    } catch (err) {
      console.error('Greška pri dodavanju radionice:', err)
      setError('Došlo je do greške prilikom dodavanja radionice.')
    }
  }

  if (loading) return <p>Učitavanje radionica...</p>
  if (error) return <p className="error-message">{error}</p>

  return (
    <div className="workshops-container">
      <h2>Upravljanje Radionicama</h2>

      <form onSubmit={handleAddWorkshop} className="add-workshop-form">
        <div className="form-group">
          <label htmlFor="newWorkshopName" className="label-add-workshop">
            Naziv nove radionice:
          </label>
          <input
            type="text"
            id="newWorkshopName"
            value={newWorkshopName}
            onChange={(e) => setNewWorkshopName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Dodaj Radionicu</button>
      </form>

      <h3>Popis Radionica</h3>
      {workshops.length === 0 ? (
        <p>Nema unesenih radionica.</p>
      ) : (
        <table className="workshops-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Naziv Radionice</th>
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
