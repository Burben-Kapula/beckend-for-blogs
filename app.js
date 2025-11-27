const express = require('express')
const cors = require('cors')
const app = express()

const blogsRouter = require('./controllers/blogs')
// const usersRouter = require('./controllers/users')

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
// app.use('/api/users', usersRouter)

// Можна додати /api/login або інші роутери

module.exports = app
