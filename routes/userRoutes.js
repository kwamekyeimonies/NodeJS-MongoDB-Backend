const express = require('express')
const userRouter = express.Router()
const usersControllers = require('../controllers/userController')

userRouter.route('/')
    .get(usersControllers.getAllUsers)
    .post(usersControllers.createNewUser)
    .patch(usersControllers.updateUser)
    .delete(usersControllers.deleteUser)

module.exports = userRouter