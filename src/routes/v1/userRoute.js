import express from 'express'
const userController = require('~/controllers/userController')
import { verifyToken, verifyTokenAndUserAuthorization } from '~/controllers/verifyToken'

const Router = express.Router()

//GET ALL USERS
Router.route('/').get(verifyToken, userController.getAllUsers)

//DELETE USER
Router.route('/:id').delete(
  verifyTokenAndUserAuthorization,
  userController.deleteUser
)

export const userRoute = Router
