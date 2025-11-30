const mongoose=require("mangoose")
mongoose=connect("")
.then(()=>{
    console.log("mongoodb connected")
})
.catch(()=>{
    console.log("failed")
})


const newSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true

    },
    password:{
        type:String,
        require:true

    }
})

const collection = mongoose.mode("collection",newSchema)



module.exports=collection