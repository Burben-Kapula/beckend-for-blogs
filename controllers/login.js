const router = require('express').Router()

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  // TODO: тут перевірка користувача в базі, порівняння пароля, видача токена
  // Поки що повернемо просто ехо, щоб перевірити зв'язок
  res.json({
    message: 'login ok',
    username,
  })
})

module.exports = router
