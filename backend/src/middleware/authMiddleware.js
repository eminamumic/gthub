const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/jwt')

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Pristup odbijen. Token nije dostavljen.' })
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Nevažeći ili istekao token.' })
    }

    req.user = user
    next()
  })
}

module.exports = {
  authenticateToken,
}
