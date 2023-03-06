const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')



const getAllNotes = asyncHandler(async(req,res)=>{
    const notes = await Note.find().lean()

    if(!notes?.length){
        return res.status(400).json({
            message:"No Notes Available"
        })
    }
    const notesWithUser = await Promise.all(notes.map(async(note)=>{
        const user =await User.findById(note.user).lean().exec()
        return{
            ...note,
            username:user.username
        }
    }))

    res.json(notesWithUser)
})