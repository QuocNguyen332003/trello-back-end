import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let DatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
  // Loại bỏ useNewUrlParser và useUnifiedTopology
})

// Kết nối DB
export const CONNECT_DB = async () => {
  try {
    await mongoClientInstance.connect()
    DatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

// Đóng kết nối DB
export const CLOSE_DB = async () => {
  try {
    await mongoClientInstance.close()
    console.log('MongoDB connection closed')
  } catch (error) {
    console.error('Failed to close MongoDB connection:', error)
  }
}

// Lấy instance của DB
export const GET_DB = () => {
  if (!DatabaseInstance) {
    throw new Error('Must connect database first!')
  }
  return DatabaseInstance
}
