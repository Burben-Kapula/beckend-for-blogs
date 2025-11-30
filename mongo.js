require("dotenv").config()
const mongoose = require("mongoose")

const uri = process.env.MONGODB_URI

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message)
  })

const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const collection = mongoose.model("collection", newSchema)

module.exports = collection
