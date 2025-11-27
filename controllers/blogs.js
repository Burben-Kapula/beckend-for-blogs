const router = require('express').Router()

router.get('/', (req, res) => {
  res.json([{ title: 'Test blog' }]) // повертає масив чи об'єкт
})

module.exports = router
