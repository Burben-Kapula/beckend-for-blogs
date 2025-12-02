const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const User = require('../models/user')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' })
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'username must be at least 3 characters' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' })
    }

    const emailRegex = /.+@.+\..+/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'invalid email' })
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({ error: 'username or email already used' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      email,
      passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'username/email and password are required' })
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    })

    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
      return res.status(401).json({ error: 'invalid credentials' })
    }

    const userForToken = {
      id: user._id,
      username: user.username
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET || 'DEV_SECRET', {
      expiresIn: '7d'
    })

    res.json({
      token,
      username: user.username,
      email: user.email,
      id: user._id.toString()
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

module.exports = router
