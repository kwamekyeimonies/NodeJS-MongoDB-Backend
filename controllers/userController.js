const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt_js = require('bcrypt')

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select('-password').lean()
    if(!users){
        return res.status(400).json({
            message:"No Users Found"
        })
    }
    res.json(users)

})

const createNewUser = asyncHandler(async(req,res)=>{
    const {username,password, roles} = req.body
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({
            message:"All Fields are required"
        })
    }
    //Check for duplicates
    const duplicate = await User.findOne({username}).lean().exec()
    if (duplicate){
        return res.status(409).json({
            message:"Username already exist"
        })
    }

    //Hash Password
    const hashpassword = await bcrypt_js.hash(password,10) 
    const userObject = {username,"password":hashpassword,roles}

    //Create and store users
    const user = await User.create(userObject)
    if(user){
        res.status(201).json({
            message:`New user ${username} created`
        })
    }
    else{
        res.status(400).json({message:"Invalid User data received"})
    }

})

const updateUser = asyncHandler(async(req,res)=>{
    const {id, username, roles,active,password} = req.body
    //Confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({
            message:"All Fields are required except password"
        })
    }
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({
            message:"User Not Found"
        })
    }
    //Check for duplicates
    const duplicate = await User.findOne({username}).lean().exec()
    //Allow updtates to the original user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({
            message:"There are duplicate Usernames"
        })
    }
    user.username = username
    user.roles = roles
    user.active = active

    if(password){
        //HashPassword
        user.password = await bcrypt_js.hash(password,10)
    }

    const updatedUser = await user.save()
    res.json({
        message:`${updatedUser.username} updated`
    })
})


const deleteUser = asyncHandler(async(req,res)=>{
    const {id} = req.body

    if(!id){
        return res.status(400).json({
            message:"User ID Required"
        })
    }

    const notes = await Note.findOne({user:id}).lean().exec()
    if(notes){
        return res.status(400).json({
            message:"User has Assigned Notes"
        })
    }
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }

    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted successfully`
    res.json(reply)
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}