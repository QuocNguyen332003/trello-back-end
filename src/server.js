import cors from 'cors'
import { corsOptions } from './config/cors'
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1/index'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()
  // Xử lí Cors
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())
  app.use(cookieParser())

  // Use API V1
  app.use('/v1', APIs_V1)

  // Middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `3. Hi ${env.AUTHOR}, Back-end Server is running successfully at http://${env.APP_HOST}:${env.APP_PORT}/`
    )
  })

  exitHook(async () => {
    console.log('4. Server is shutting down....')
    await CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

// Chỉ khi kết nối DB thành công thì mới start server back-end lên
// IIFE
;(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas')

    // Khởi động Server sau khi kết nối DB thành công
    START_SERVER()
  } catch (error) {
    console.error('Error during server start-up:', error)
    process.exit(1)
  }
})()
