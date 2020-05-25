import mongoose from '../config/DB_handle.js'
import moment from 'moment'

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  'uid':{type: String, ref:'users'},
  'title':{type:String},
  'content':{type:String},
  'create_time':{type:Date},
  'catalog':{type:String},
  'score':{type:Number},
  'tags':{type:String},
  'sore':{type:String},
  'read_s':{type:Number},
  'answ_s':{type:Number},
  'state_sub':{type:String},
  'isTop':{type:String}
})

ArticleSchema.static('getList',function(options,sort,page,limit){
  if(options.catalog == 'index'){
    delete options.catalog
  }

  return this.find(options)
             .sort({[sort]:-1})
             .skip(page*limit)
             .limit(limit)
             .populate({
               path:'uid',
               select:'name isVip avar'
             })
})

ArticleSchema.static('get_list_detail',function(options){
  return this.findOne(options)
             .populate({
               path:'uid',
               select:'name isVip avar'
             })
})

ArticleSchema.static('get_list_id',function(options,sort,page,limit){
  return this.find(options)
             .sort({[sort]:-1})
             .skip(page*limit)
             .limit(limit)
})

ArticleSchema.static('getTopWeek',function(){
  return this.find({
    create_time:{
      $gte: moment().subtract(7,'days')
    }
  }, {answ_s:1, title:1}).sort({'answ_s':-1}).limit(15)
})

ArticleSchema.pre('save', function(next){
  this.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

const ArticleModel = mongoose.model('articles',ArticleSchema)



export default ArticleModel
