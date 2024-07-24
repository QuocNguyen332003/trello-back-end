import User from '~/models/userModel'
import { StatusCodes } from 'http-status-codes'

// GET ALL USER
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(StatusCodes.OK).json(users)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
  }
}

// DELETE A USER
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(StatusCodes.OK).json('User deleted')
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
  }
}
