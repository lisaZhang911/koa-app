import Router from 'koa-router'
const router = new Router()

import userController from '../api/UserController'
import articleController from '../api/ArticleController'

router.get('/sign',userController.sign)
router.post('/base_update',userController.baseInfo_update)
router.get('/verify_mail',userController.verify_mail)
router.post('/mail_update',userController.mail_update)
router.post('/upload_img',userController.upload_img)
router.post('/password_update',userController.password_update)
router.post('/add_post',articleController.add_post)

export default router
