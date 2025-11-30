// backend/utils/config.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env'), debug: true })

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  PORT,
  MONGODB_URI
}
