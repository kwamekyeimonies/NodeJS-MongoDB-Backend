const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        requred:true
    },
    password:{
        type:String,
        required:true
    },
    roles:[{
        type:String,
        default:"Employee"
    }],
    active:{
        type:Boolean,
        default:"Employee"
    }
})

module.exports = mongoose.model('User',userSchema)