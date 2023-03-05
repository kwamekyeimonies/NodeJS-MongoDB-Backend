const express = require('express')
const rootRouter = express.Router()
const path = require('path')

rootRouter.get(
    "^/$|/index(.html)?",
    (req,res)=>{
        res.sendFile(path.join(__dirname,'..','views','index.html'))
    }
)

module.exports = rootRouter