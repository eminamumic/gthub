const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.admin = decoded
      next()
    } catch (error) {
      console.error('Token verifikacija neuspješna:', error.message)
      return res
        .status(401)
        .json({ message: 'Nije autorizovano, token neuspješan.' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Nije autorizovano, nema tokena.' })
  }
}

module.exports = { protect }
