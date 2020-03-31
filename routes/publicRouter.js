import Router from 'koa-router'
const router = new Router()

import publicController from '../api/PublicController'

router.get('/demo',publicController.getCaptcha)

export default router
