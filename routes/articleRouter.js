import Router from 'koa-router'
const router = new Router()

import articleController from '../api/ArticleController'

router.post('/add_post',articleController.add_post)

export default router
