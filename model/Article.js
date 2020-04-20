import mongoose from '../config/DB_handle.js'
import moment from 'moment'

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  'uid':{type: String, ref:users},
  'title':{type:String},
  'content':{type:String},
  'create_time':{type:Date},
  'catalog':{type:String},
  'score':{type:Number},
  'state':{type:String},
  'sore':{type:String},
  'read_s':{type:Number},
  'answ_s':{type:Number},
  'state_sub':{type:String},
  'isTop':{type:String},
  'precious':{type:String}
})

ArticleSchema.static('getList',function(options,sort,page,limit){
  // console.log('opstions',options);
  // console.log('sort',sort);
  // console.log('page',page);
  // console.log('limit',limit);
  return this.find(options)
             .sort({[sort]:-1})
             .skip(page*limit)
             .limit(limit)
             .populate({
               path:'uid',
               select:'name'
             })
})

ArticleSchema.pre('save', function(next){
  console.log('pre');
  this.create_time = moment().format('YYYY-MM-DD hh:mm:ss')
  next()
})

const ArticleModel = mongoose.model('articles',ArticleSchema)



export default ArticleModel
