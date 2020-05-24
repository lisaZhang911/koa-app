import ArticleModel from '../model/Article.js'
import User_model from '../model/User.js'
import Comment_model from '../model/Comment.js'
import Good_model from '../model/Good_comment.js'
import { checkCode,getJWT_token } from '../utils/common.js'


class ArticleController {
  constructor(){}
  async getArticleList(ctx){
    const options = {}

    // const post = new ArticleModel({
    //   title:'第六篇文字',
    //   content:' u 如日特哦图饿哦如图俄日图',
    //   catalog:'ask',
    //   score:10,
    //   state:'0',
    //   read_s:0,
    //   tags:'1',
    //   answ_s:340,
    //   state_sub:'1',
    //   isTop:'0',
    //   precious:'1'
    // })
    //
    // const tmp = await post.save()
    const  body  = ctx.request.query

    const sort = body.sort
    const page = parseInt(body.page)
    const page_limit = parseInt(body.page_limit)

    options.catalog = body.catalog
    if(body.tags != undefined && body.tags != null){
      options.tags = body.tags
    }


    if(typeof body.isTop != 'undefined'){
      options.isTop = body.isTop
    }
    console.log('option',options);
    const result = await ArticleModel.getList(options,sort,page,page_limit)
    ctx.body = {
      code:200,
      data:result,
      err_msg:''
    }
  }

  async getTopWeek(ctx){
    const result = await ArticleModel.getTopWeek()
    ctx.body = {
      code:200,
      data:result,
      err_msg:''
    }
  }

  async add_post(ctx){
    //1、获取前端传过来的数据
    const {body} = ctx.request
    body.tags = '1'
    body.read_s = 0
    body.answ_s = 0
    body.isTop = '0'
    body.precious = '1'
    const token = ctx.header.authorization
    const score = body.score
    const catalog = body.catalog
    //2、从第1步提取sid和code，检查验证码

      //2.1、如果第2步正确，则通过token解析出用户id
      //2.2、判断用户积分是否够支付文章积分
        //2.2.1、如果够，则把信息存入数据库
      const obj =  getJWT_token(token)
      const user = await User_model.findById(obj._id)

      if((score > user.score) && catalog == 'ask'){
        ctx.body = {
          code:200,
          err_msg:'',
          data:{result:'你的积分不够'}
        }
      } else {
        body.uid = obj._id
        console.log('body',body);
        const post = new ArticleModel(body)
        await post.save()
        ctx.body = {
          code:200,
          err_msg:'',
          data:{result:'发表成功'}
        }
      }
  }

  async get_postDetail(ctx){
    const id = ctx.request.query.id
    const post = await ArticleModel.get_list_detail({_id:id})
    ctx.body = {
      code:200,
      err_msg:'',
      data:post
    }
  }

  async add_comment(ctx){
    //获取前端传过来的数据：uid / tid / content
    const options = {}
    const {body} = ctx.request
    options.uid = body.uid
    options.tid = body.tid
    options.content = body.content

    const comment = new Comment_model(options)
    await comment.save()

    ctx.body = {
      code:200,
      err_msg:'',
      data:{result:'评论成功'}
    }
  }

  async get_commentList(ctx){
    //获取前端传过来的数据：tid / page / page_limit
    const query = ctx.request.query
    const page = Number(query.page)
    const page_limit = Number(query.page_limit)

    const result = await Comment_model.getCommentList({tid:query.tid},page,page_limit)
    const list_quality = await Comment_model.comment_list_quality(query.tid)

    ctx.body = {
      code:200,
      err_msg:'',
      data:{result:result,page_total:Math.ceil(list_quality/page_limit)}
    }
  }

  async set_best(ctx){
    //获取前端传来的数据：cid,此为该评论的id
    const {body} = ctx.request
    const cid = body.cid
    //判断此操作者是不是该文章作者
      //1、获取操作者ID
    const token = ctx.header.authorization
    const obj = getJWT_token(token)
    const oper_id = obj._id
      //2、获得该文章ID
    const comment_info = await Comment_model.findOne({_id:cid})
    const post_id = comment_info.uid
      //3、对比两个ID是否相同
    if(oper_id == post_id){
      await Comment_model.updateOne({_id:cid},{$set:{isBest:'1'}})
      ctx.body = {
        code:200,
        err_msg:'',
        data:{result:'采纳成功'}
      }
    } else {
        ctx.body = {
          code:500,
          err_msg:'您无权操作采纳',
          data:{}
        }
    }
  }

  async set_good(ctx){
    //获取前端传过来的数据：cid，此为该评论的ID
    const {body} = ctx.request
    const uid = getJWT_token(ctx.header.authorization)._id
    const cid = body.cid
    //判断该用户是否已点赞
    const queryResult = await Good_model.findOne({uid:uid})
    if(queryResult == null){
      //新增点赞记录
      const good = new Good_model({
        cid:cid,
        uid:uid
      })
      await good.save()
      //更新评论表中的点赞计数
      await Comment_model.updateOne({_id:cid},{$inc:{good_count:1}})
      ctx.body = {
        code:200,
        err_msg:'',
        data:{result:'点赞成功'}
      }
    } else {
      ctx.body = {
        code:500,
        err_msg:'不可重复点赞',
        data:{}
      }
    }
  }
}

export default new ArticleController()
