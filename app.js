const express = require("express")
const cors = require("cors")

const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/login")
const collection = require("./mongo")

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// root‑маршрут (той що на скріні)
app.get("/",cors(),(req,res)=>{

})
app.post("/singup",async(req,res)=>{
    const{name,email,password}=req.body

    const data={
        name:name,
        email:email,
        password:password
    }

    try{
        const check=await collection.findOne({email:email})
        if(check){
            res.json("Exist")
        } 
        else{
            res.json("noexist")
            await collection.insertMany([data])
        }
    }
    catch(e){
        console.log(e) 
        res.json("notexist")
    }
})



// API‑маршрути
app.use("/api/blogs", blogsRouter)
app.use("/api", usersRouter) // тут буде POST /api/login, /api/users і т.д.

module.exports = app
