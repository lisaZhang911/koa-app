import Router from 'koa-router'
const router = new Router()

import userController from '../api/UserController'

router.get('/sign',userController.sign)


export default router
