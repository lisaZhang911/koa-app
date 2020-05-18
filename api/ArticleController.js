import ArticleModel from '../model/Article.js'
import User_model from '../model/User.js'
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
    const sid = body.sid
    const code = body.code
    const token = ctx.header.authorization
    const score = body.score
    const catalog = body.catalog
    //2、从第1步提取sid和code，检查验证码

    let checkCode_result = await checkCode(sid,code)
      //2.1、如果第2步正确，则通过token解析出用户id
      //2.2、判断用户积分是否够支付文章积分
        //2.2.1、如果够，则把信息存入数据库
    if(checkCode_result){
      const obj =  getJWT_token(token)
      const user = await User_model.findById(obj._id)
      console.log('user',user);
      if(score > user.score && catalog == 'ask'){
        ctx.body = {
          code:200,
          err_msg:'',
          data:{result:'你的积分不够'}
        }
      } else {
        const post = new ArticleModel(body)
        await post.save()
        ctx.body = {
          code:200,
          err_msg:'',
          data:{result:'发表成功'}
        }
      }
    } else {
      ctx.body = {
        code:500,
        err_msg:'验证码过期或错误',
        data:{}
      }
    }
  }
}

export default new ArticleController()
