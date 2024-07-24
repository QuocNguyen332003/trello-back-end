import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

// Định nghĩa tên collection và schema cho người dùng
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  isAdmin: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

// Tạo một người dùng mới
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newUserToAdd = {
      ...validData,
      _id: new ObjectId() // Thêm ID nếu cần thiết
    }
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(newUserToAdd)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

// Xác thực dữ liệu trước khi tạo người dùng
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}
const findOneByUsername = async (username) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ username })
    return user
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`)
  }
}

const findOneByEmail = async (email) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email })
    return user
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`)
  }
}
// Tìm một người dùng theo ID

// Xuất model người dùng
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneByUsername,
  findOneByEmail
}
