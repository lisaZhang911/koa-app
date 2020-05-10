import Router from 'koa-router'
const router = new Router()

import userController from '../api/UserController'

router.get('/sign',userController.sign)
router.post('/base_update',userController.baseInfo_update)
router.post('/verify_mail',userController.verify_mail)
router.post('/mail_update',userController.mail_update)

export default router
