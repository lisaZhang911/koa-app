import Router from 'koa-router'
const router = new Router()

import publicController from '../api/PublicController'
import articleController from '../api/ArticleController'

router.prefix('/public')
router.get('/getCode',publicController.getCaptcha)
router.get('/getArticleList',articleController.getArticleList)

export default router
