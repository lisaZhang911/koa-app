import Router from 'koa-router'
const router = new Router()

import articleController from '../api/ArticleController'

router.post('/add_post',articleController.add_post)
router.post('/edit_post',articleController.edit_post)
router.post('/add_comment',articleController.add_comment)
router.get('/public/comments',articleController.get_commentList)
router.post('/set_best',articleController.set_best)
router.post('/set_good',articleController.set_good)
router.get('/get_collectState',articleController.collect_state)
router.post('/collect_post',articleController.collect_post)
router.get('/get_listById',articleController.getArticleList_id)
router.get('/get_collectList',articleController.get_collectList)

export default router
