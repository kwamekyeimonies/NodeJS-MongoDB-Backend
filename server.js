const express = require("express")
require('dotenv').config()
const app = express()
const PORT = process.env.PORT
const path = require('path')
const {logger, logEvents} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')
const mongoose = require('mongoose')

connectDB()
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
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
app.get("/test",(req,res)=>{
    res.send("Backend API Running")
})
app.use(errorHandler)

mongoose.connection.once('open',()=>{
    console.log("Database Connected....")
    app.listen(
        PORT,
        ()=>{
            console.log(`Server running on http://localhost:${PORT}`)
        }
    )
})
mongoose.connection.on('error',err =>{
    console.log(err)
    logEvents(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log')
})