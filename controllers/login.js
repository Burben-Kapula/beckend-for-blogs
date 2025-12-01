const router = require("express").Router()
const collection = require("../mongo")

// ЛОГІН
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await collection.findOne({ email })

    if (!user) {
      return res.json({ status: "no-user" }) // користувача не існує
    }

    if (user.password !== password) {
      return res.json({ status: "wrong-password" })
    }

    return res.json({ status: "ok" })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ status: "error" })
  }
})

module.exports = router
