const express = require('express')
const cors = require('cors')
const authMiddleware = require('./utils/authMiddleware') // якщо він є

const app = express()

app.use(cors())
app.use(express.json())

// ПУБЛІЧНІ РОУТИ (без токену)
app.use('/api/auth', require('./controllers/auth'))

// ЗАХИЩЕНІ РОУТИ (з токеном)
app.use('/api/blogs', authMiddleware, require('./controllers/blogs'))

module.exports = app
