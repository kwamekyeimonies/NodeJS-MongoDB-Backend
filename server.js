const express = require("express")
require('dotenv').config()
const app = express()
const PORT = process.env.PORT
const path = require('path')
const {logger} = require('./middleware/logger')


app.use(logger)
app.get("/test",(req,res)=>{
    res.send("Backend API Running")
})
app.use(express.json())

app.use(
    "/",
    express.static(path.join(__dirname,'/public'))
)
app.use(
    "/",
    require("./routes/root")
)
app.all('*',(req,res)=>{
    res.status(404)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }
    else if(req.accepts('json')){
        res.json({
            message:"404 Not Found"
        })
    }
    else{
        res.type('txt').send('404 Not found')
    }
}) 

app.listen(
    PORT,
    ()=>{
        console.log(`Server running on http://localhost:${PORT}`)
    }
)