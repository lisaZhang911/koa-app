import ArticleModel from '../model/Article.js'

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
}

export default new ArticleController()
