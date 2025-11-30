// backend/index.js
const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const server = http.createServer(app)

const PORT = config.PORT || 3001
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
