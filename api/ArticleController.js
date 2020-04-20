import ArticleModel from '../model/Article.js'

class ArticleController {
  constructor(){}
  async getArticleList(ctx){
    // const post = new ArticleModel({
    //   title:'第五篇文字',
    //   content:' u 如日特哦图饿哦如图俄日图',
    //   catalog:'share',
    //   score:10,
    //   state:'0',
    //   sort:'created_time',
    //   read_s:0,
    //   answ_s:0,
    //   state_sub:'1',
    //   isTop:'0',
    //   precious:'1'
    // })
    //
    // const tmp = await post.save()
    // console.log(tmp);
    const  body  = ctx.request.query

    const sort = body.sort == undefined?'create_time':body.sort
    const state = body.state == undefined?'0':body.state
    const page = body.page == undefined ?1:parseInt(body.page)
    const page_limit = body.page_limit= 20
    const options = {}

    options.catalog = body.catalog

    if(typeof body.isTop != 'undefined'){
      options.isTop = body.isTop
    }
    if(typeof body.state != 'undefined'){
      options.state = body.state
    }
    if(typeof body.precious != 'undefined'){
      options.precious = body.precious
    }

    const result = await ArticleModel.getList(options,sort,page,page_limit)
    ctx.body = {
      code:200,
      data:result,
      err_msg:''
    }
  }
}

export default new ArticleController()
