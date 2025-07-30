require('dotenv').config()

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_if_not_set',
  jwtExpiresIn: '1h',
}
