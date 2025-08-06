// frontend/src/index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import axios from 'axios'
import { BrowserRouter as Router } from 'react-router-dom' // OVO JE JEDINI ISPRAVAN IMPORT ROUTERA

axios.defaults.baseURL = 'http://localhost:5000'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      {' '}
      {/* OVO JE JEDINI <Router> U APLIKACIJI */}
      <App />
    </Router>
  </React.StrictMode>
)
