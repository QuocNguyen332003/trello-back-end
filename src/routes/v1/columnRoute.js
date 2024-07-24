import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()

/** Check API V1 stastus **/
Router.route('/').post(columnValidation.createNew, columnController.createNew)
Router.route('/:id')
  .put(columnValidation.update, columnController.update)
  .delete(columnValidation.deleteItem, columnController.deleteItem) //update
export const columnRoute = Router
