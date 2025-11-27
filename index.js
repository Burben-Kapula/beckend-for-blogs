const app = require('./app') // Імпорт основного додатка
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger') // За потребою для логування

const server = http.createServer(app)

const PORT = config.PORT || 3001
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
