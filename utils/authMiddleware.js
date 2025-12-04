const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const auth = req.get('authorization')
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const token = auth.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DEV_SECRET')
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'token invalid' })
  }
}

module.exports = authMiddleware