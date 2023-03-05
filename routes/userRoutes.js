const express = require('express')
const userRouter = express.Router()

userRouter.route('/')
    .get()
    .post()
    .patch()
    .delete()