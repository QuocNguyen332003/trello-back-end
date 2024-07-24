/* eslint-disable no-console */
/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  try {
    // Xử lí login dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong DB
    const createdBoard = await boardModel.createNew(newBoard)

    // Lấy bảng ghi board sau khi gọi (tuỳ mục đích dự án mà cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // Trả kết quả về trong Service, trong Service phải luôn có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong DB
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // B1: Deep clone board ra một cái mới để xử lí, không ảnh hưởng tới board ban đầu, tuỳ mục đích về sau mà có
    // cần clone deep hay không
    const resBoard = cloneDeep(board)
    // B2: Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      // Cách này dùng .equals này bởi vì chúng ta hiểu ObjectId trong MongoDB có support method .equal
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      )

      // Cách khác đơn giản là convert ObjectId về sttring bằng hàm toString() của Javascripts
      // column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString)
    })

    // B3: Xoá mảng cards khỏi board ban đầu
    delete resBoard.cards

    // Trả kết quả về trong Service, trong Service phải luôn có return
    return resBoard
  } catch (error) {
    throw error
  }
}
const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardDifferentColumn = async (reqBody) => {
  try {
    // B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Bản chất là xoá _id của Card ra khỏi mảng)
    columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updateAt: Date.now()
    })
    // B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Bản chất là thêm _id của Card vào mảng)
    columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now()
    })
    // B3: Cập nhật lại trường columnId mới của Card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully!!!' }
  } catch (error) {
    throw error
  }
}
export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardDifferentColumn
}
