import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: '2d' }
  )
}

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )
}
