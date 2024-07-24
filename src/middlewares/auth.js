import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

export const auth = (req, res, next) => {
  const whiteLists = ['/v1/auth/login', '/v1/auth/register']

  if (whiteLists.includes(req.originalUrl)) {
    next()
  } else if (req?.headers?.authorization?.split(' ')[1]) {
    const token = req.headers.authorization.split(' ')[1]
    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
      console.log('Check token: ', decoded)
      next()
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json(error)
    }
    //verify
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Bạn chưa truyền token/token bị hết hạn' })
  }
}
