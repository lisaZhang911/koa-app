import Router from 'koa-router'
const router = new Router()

import publicController from '../api/PublicController'
import articleController from '../api/ArticleController'

router.prefix('/public')
router.get('/getCode',publicController.getCaptcha)
router.get('/listChannel',articleController.getArticleList)
router.get('/week_board',articleController.getTopWeek)

export default router
