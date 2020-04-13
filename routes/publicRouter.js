import Router from 'koa-router'
const router = new Router()

import publicController from '../api/PublicController'

router.prefix('/public')
router.get('/getCode',publicController.getCaptcha)

export default router
