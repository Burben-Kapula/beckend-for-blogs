const http = require('http')
const app = require('./app')  // або './index', './server' – подивись як там

const server = http.createServer(app)

const PORT = process.env.PORT || 3003
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
