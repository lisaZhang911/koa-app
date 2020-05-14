import Router from 'koa-router'
const router = new Router()

import loginController from '../api/LoginController'

router.post('/forget',loginController.forget)
router.post('/login',loginController.login)
router.post('/reg',loginController.registry)
router.post('/reset_pwd',loginController.password_reset)

export default router
