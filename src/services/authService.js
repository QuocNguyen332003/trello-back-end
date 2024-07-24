import bcrypt from 'bcrypt'
import { userModel } from '~/models/userModel'
import { generateAccessToken, generateRefreshToken } from '~/utils/tokenUtil'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const refreshTokens = []

const registerUser = async (userData) => {
  try {
    const existingUser = await userModel.findOneByEmail(userData.email)
    if (existingUser) {
      throw new Error('Email đã được sử dụng')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userData.password, salt)

    const newUser = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword
    }

    const createdUser = await userModel.createNew(newUser)
    return createdUser
  } catch (error) {
    throw error
  }
}

const loginUser = async (loginData) => {
  try {
    const user = await userModel.findOneByUsername(loginData.username)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Incorrect username')
    }

    const validPassword = await bcrypt.compare(
      loginData.password,
      user.password
    )
    if (!validPassword) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Incorrect password')
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    refreshTokens.push(refreshToken)

    const { password, ...others } = user
    return { user: others, accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}

export const authService = {
  registerUser,
  loginUser
}
