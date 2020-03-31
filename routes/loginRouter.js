import Router from 'koa-router'
const router = new Router()

import loginController from '../api/LoginController'

router.post('/forget',loginController.forget)

export default router
