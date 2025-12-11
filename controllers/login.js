const router = require('express').Router()

// POST /api/login
router.post('/', async (req, res) => {
  const { name, password } = req.body

  // TODO: тут перевірка користувача в базі, порівняння пароля, видача токена
  // Поки що повернемо просто ехо, щоб перевірити зв'язок
  res.json({
    message: 'login ok',
    name,
  })
})

module.exports = router




import { useLocation, useNavigate } from "react-router-dom"

function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.id

  if (!email) {
    // якщо зайшли напряму без логіну – повернути на /
    navigate("/")
    return null
  }

  return (
    <div>
      <h1>Hello {email}, welcome to my web site</h1>
    </div>
  )
}

export default Home
