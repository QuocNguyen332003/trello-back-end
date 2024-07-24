import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { authRoute } from '~/routes/v1/authRoute'
import { userRoute } from '~/routes/v1/userRoute'
import { auth } from '~/middlewares/auth'

const Router = express.Router()


Router.get('/status', (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: 'APIs V1 are ready to use', code: StatusCodes.OK })
})
Router.all('*', auth)
// Auth API
Router.use('/auth', authRoute)
// User API
Router.use('/users', userRoute)
//Board API
Router.use('/boards', boardRoute)
//Column API
Router.use('/columns', columnRoute)
//Card API
Router.use('/cards', cardRoute)

export const APIs_V1 = Router


