import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import { generateAccessToken, generateRefreshToken } from '~/utils/tokenUtil'
import jwt from 'jsonwebtoken'

let refreshTokens = []
// REGISTER
const registerUser = async (req, res, next) => {
  try {
    // Validate request body và chuẩn bị dữ liệu
    const createdUser = await authService.registerUser(req.body)
    // Trả về phản hồi thành công
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    // Chuyển lỗi tới middleware xử lý lỗi
    next(error)
  }
}

// LOGIN
const loginUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(
      req.body
    )

    // STORE REFRESH TOKEN IN COOKIE
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })

    res.status(StatusCodes.OK).json({ user, accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
}
export const requestRefreshToken = async (req, res) => {
  //Take refresh token from user
  const refreshToken = req.cookies.refreshToken
  //Send error if token is not valid
  console.log('refreshToken: ', refreshToken)
  if (!refreshToken) return res.status(401).json('You are not authenticated')
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json('Refresh token is not valid')
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      console.log(err)
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    //create new access token, refresh token and send to user
    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)
    refreshTokens.push(newRefreshToken)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })
  })
}

// LOG OUT
const logOut = async (req, res) => {
  // Clear cookies when user logs out
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.clearCookie('refreshToken')
  res.status(200).json('Logged out successfully!')
}

export const authController = {
  loginUser,
  // requestRefreshToken,
  logOut,
  registerUser,
  requestRefreshToken
}
