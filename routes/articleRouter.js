import Router from 'koa-router'
const router = new Router()

import articleController from '../api/ArticleController'

router.post('/add_post',articleController.add_post)
router.post('/add_comment',articleController.add_comment)
router.get('/public/comments',articleController.get_commentList)
router.post('/set_best',articleController.set_best)
router.post('/set_good',articleController.set_good)

export default router
