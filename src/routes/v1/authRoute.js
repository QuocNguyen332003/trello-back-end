import express from 'express'
import { authController } from '~/controllers/authController'
import { verifyToken } from '~/controllers/verifyToken'

const Router = express.Router()
//REGISTER
Router.post('/register', authController.registerUser)

//REFRESH TOKEN
Router.post('/refresh', authController.requestRefreshToken)
//LOG IN
Router.post('/login', authController.loginUser)
//LOG OUT
Router.post('/logout', verifyToken, authController.logOut)

export const authRoute = Router
